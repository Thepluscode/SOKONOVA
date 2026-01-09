import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChatHistory(userId: string, recipientId: string) {
    // In a real implementation, we would have a proper chat system
    // For now, we'll return mock data
    return [
      {
        id: '1',
        senderId: userId,
        recipientId,
        message: 'Hello! I\'m interested in your product.',
        timestamp: new Date(),
      },
      {
        id: '2',
        senderId: recipientId,
        recipientId: userId,
        message: 'Hi there! Thanks for your interest. What would you like to know?',
        timestamp: new Date(Date.now() - 3600000),
      },
    ];
  }

  async sendMessage(data: {
    senderId: string;
    recipientId: string;
    message: string;
  }) {
    // In a real implementation, we would store the message in a database
    // and possibly send it through a WebSocket or push notification
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      timestamp: new Date(),
    };
  }

  async getRecommendedProducts(userId: string) {
    // Get user's recent views
    const recentViews = await this.prisma.productView.findMany({
      where: { userId },
      take: 5,
      orderBy: { timestamp: 'desc' },
      include: {
        product: true,
      },
    });
    
    // Get products from the same categories as recently viewed products
    const categoryIds = recentViews.map(view => view.product.category);
    const uniqueCategories = [...new Set(categoryIds)].filter(Boolean);
    
    let recommendedProducts = [];
    if (uniqueCategories.length > 0) {
      recommendedProducts = await this.prisma.product.findMany({
        where: {
          category: { in: uniqueCategories },
          id: {
            notIn: recentViews.map(view => view.productId),
          },
        },
        take: 5,
        include: {
          productReviews: {
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }
    
    return recommendedProducts;
  }

  async compareProducts(productIds: string[]) {
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      include: {
        productReviews: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    return products;
  }

  // AUTHENTICATED: Get AI-powered answer for product questions
  async getAnswer(userId: string, productId: string, question: string) {
    // Get product details
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: true,
        productReviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Get user preferences
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Analyze the question to determine intent
    const intent = this.analyzeQuestionIntent(question);

    // Generate response based on intent
    let answer = '';
    switch (intent) {
      case 'product_details':
        answer = this.generateProductDetailsResponse(product, question);
        break;
      case 'pricing':
        answer = this.generatePricingResponse(product, question);
        break;
      case 'availability':
        answer = this.generateAvailabilityResponse(product, question);
        break;
      case 'reviews':
        answer = this.generateReviewsResponse(product, question);
        break;
      case 'comparison':
        answer = await this.generateComparisonResponse(product, question, userId);
        break;
      default:
        answer = this.generateGeneralResponse(product, question, user);
    }

    return {
      answer,
      intent,
      productId,
      relatedProducts: await this.getRelatedProducts(product, userId),
    };
  }

  // Compare multiple products based on user question
  async compareProductsByIds(userId: string, productIds: string[], question: string) {
    // Get all products
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        seller: true,
        productReviews: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (products.length === 0) {
      throw new Error('No products found');
    }

    // Generate comparison response
    const answer = this.generateMultiProductComparison(products, question);

    return {
      answer,
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        currency: p.currency,
        ratingAvg: p.ratingAvg,
        ratingCount: p.ratingCount,
      })),
    };
  }

  // Helper method to analyze question intent
  private analyzeQuestionIntent(question: string): string {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('expensive') || lowerQuestion.includes('cheap')) {
      return 'pricing';
    }

    if (lowerQuestion.includes('available') || lowerQuestion.includes('stock') || lowerQuestion.includes('in stock')) {
      return 'availability';
    }

    if (lowerQuestion.includes('review') || lowerQuestion.includes('rating') || lowerQuestion.includes('quality')) {
      return 'reviews';
    }

    if (lowerQuestion.includes('compare') || lowerQuestion.includes('difference') || lowerQuestion.includes('better')) {
      return 'comparison';
    }

    if (lowerQuestion.includes('material') || lowerQuestion.includes('size') || lowerQuestion.includes('color') || lowerQuestion.includes('spec')) {
      return 'product_details';
    }

    return 'general';
  }

  // Generate product details response
  private generateProductDetailsResponse(product: any, question: string): string {
    const features = [];
    
    if (product.title) features.push(`**Title**: ${product.title}`);
    if (product.description) features.push(`**Description**: ${product.description.substring(0, 100)}...`);
    if (product.category) features.push(`**Category**: ${product.category}`);
    
    if (features.length > 0) {
      return `Here are the details about **${product.title}**:\n\n${features.join('\n')}\n\nIs there anything specific about this product you'd like to know more about?`;
    }
    
    return `This is **${product.title}**. I can provide more specific details if you ask about particular aspects of the product.`;
  }

  // Generate pricing response
  private generatePricingResponse(product: any, question: string): string {
    if (product.price && product.currency) {
      return `The price for **${product.title}** is ${product.currency} ${product.price.toFixed(2)}. This is a ${product.category} product from ${product.seller?.shopName || 'the seller'}.`;
    }
    
    return `I don't have the specific pricing information for **${product.title}** right now. You might want to check the product page for the most up-to-date pricing.`;
  }

  // Generate availability response
  private generateAvailabilityResponse(product: any, question: string): string {
    // In a real implementation, this would check inventory
    return `**${product.title}** is currently available for purchase. You can add it to your cart directly from the product page.`;
  }

  // Generate reviews response
  private generateReviewsResponse(product: any, question: string): string {
    if (product.reviews && product.reviews.length > 0) {
      const avgRating = product.ratingAvg?.toFixed(1) || 'N/A';
      const reviewCount = product.ratingCount || product.reviews.length;
      
      const recentReview = product.reviews[0];
      const recentReviewText = recentReview?.comment?.substring(0, 100) + '...' || 'No comment provided';
      
      return `**${product.title}** has an average rating of ${avgRating} stars from ${reviewCount} reviews.\n\nRecent review: "${recentReviewText}"\n\nWould you like to see more reviews or have questions about specific aspects of the product?`;
    }
    
    return `**${product.title}** doesn't have any reviews yet. Be the first to review this product after your purchase!`;
  }

  // Generate comparison response
  private async generateComparisonResponse(product: any, question: string, userId: string): Promise<string> {
    // Get similar products for comparison
    const similarProducts = await this.prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
      },
      take: 3,
      orderBy: { ratingAvg: 'desc' },
    });

    if (similarProducts.length > 0) {
      const comparisonList = similarProducts
        .map(p => `- **${p.title}**: ${p.currency} ${p.price.toFixed(2)} (${p.ratingAvg?.toFixed(1) || 'N/A'} stars)`)
        .join('\n');
      
      return `Here are some similar products to **${product.title}**:\n\n${comparisonList}\n\nWould you like me to compare specific features between these products?`;
    }
    
    return `**${product.title}** is one of the top products in its category. I don't have direct comparisons available right now, but it has a rating of ${product.ratingAvg?.toFixed(1) || 'N/A'} stars.`;
  }

  // Generate general response
  private generateGeneralResponse(product: any, question: string, user: any): string {
    // Simple keyword matching for general questions
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('return') || lowerQuestion.includes('refund')) {
      return `The return policy for **${product.title}** follows our standard marketplace policy. You can return items within 30 days of purchase for a full refund, provided they're in original condition. Contact the seller directly through the messaging system for return arrangements.`;
    }
    
    if (lowerQuestion.includes('shipping') || lowerQuestion.includes('delivery')) {
      return `Shipping for **${product.title}** is handled by ${product.seller?.shopName || 'the seller'}. Delivery times vary by location, but most orders are processed within 1-2 business days. You can message the seller for specific shipping inquiries.`;
    }
    
    if (lowerQuestion.includes('warranty') || lowerQuestion.includes('guarantee')) {
      return `**${product.title}** comes with the standard marketplace guarantee. If you're not satisfied with your purchase, you can request a refund within 30 days. Additionally, ${product.seller?.shopName || 'the seller'} may offer their own warranty - you can check the product description or ask them directly.`;
    }
    
    // Default response
    return `I can help you with questions about **${product.title}**. You can ask me about:\n- Product details and specifications\n- Pricing and availability\n- Reviews and ratings\n- Comparisons with similar products\n- Return and shipping policies\n\nWhat would you like to know?`;
  }

  // Generate multi-product comparison
  private generateMultiProductComparison(products: any[], question: string): string {
    // Create a simple comparison table
    const productInfo = products.map(p => ({
      name: p.title,
      price: `${p.currency} ${p.price.toFixed(2)}`,
      rating: p.ratingAvg?.toFixed(1) || 'N/A',
      reviews: p.ratingCount || 0,
    }));

    const comparisonLines = productInfo.map(info => 
      `- **${info.name}**: ${info.price} | ${info.rating} stars (${info.reviews} reviews)`
    );

    return `Here's a quick comparison of the products you asked about:\n\n${comparisonLines.join('\n')}\n\nWould you like more details about any specific product?`;
  }

  // Get related products for suggestions
  private async getRelatedProducts(product: any, userId: string) {
    // Get products from the same category
    const relatedProducts = await this.prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
      },
      take: 3,
      orderBy: { ratingAvg: 'desc' },
      include: {
        seller: {
          select: {
            shopName: true,
          },
        },
      },
    });

    return relatedProducts.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      currency: p.currency,
      ratingAvg: p.ratingAvg,
      shopName: p.seller?.shopName,
    }));
  }
}