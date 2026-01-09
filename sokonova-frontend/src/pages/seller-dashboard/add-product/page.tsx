import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';

export default function AddProduct() {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    // Basic Information
    productName: '',
    category: '',
    subcategory: '',
    description: '',
    shortDescription: '',
    
    // Pricing & Inventory
    price: '',
    comparePrice: '',
    costPerItem: '',
    sku: '',
    barcode: '',
    trackQuantity: true,
    quantity: '',
    lowStockThreshold: '',
    
    // Shipping
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    shippingFrom: '',
    processingTime: '',
    
    // SEO & Visibility
    seoTitle: '',
    seoDescription: '',
    tags: '',
    status: 'draft'
  });

  const categories = [
    'Fashion & Clothing',
    'Arts & Crafts',
    'Jewelry & Accessories',
    'Home & Living',
    'Beauty & Personal Care',
    'Electronics',
    'Books & Media',
    'Food & Beverages',
    'Sports & Outdoors',
    'Toys & Games'
  ];

  const subcategories = {
    'Fashion & Clothing': ['Dresses', 'Shirts & Tops', 'Traditional Wear', 'Shoes', 'Bags'],
    'Arts & Crafts': ['Paintings', 'Sculptures', 'Textiles', 'Pottery', 'Wood Crafts'],
    'Jewelry & Accessories': ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Watches'],
    'Home & Living': ['Furniture', 'Decor', 'Kitchen & Dining', 'Bedding', 'Storage'],
    'Beauty & Personal Care': ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Natural Products']
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
            if (!imagePreview && newImages.length > 0) {
              setImagePreview(newImages[0]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (imagePreview === images[index]) {
      setImagePreview(newImages[0] || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save product data
    const productData = {
      ...formData,
      images,
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage (in production, this would be an API call)
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    existingProducts.push(productData);
    localStorage.setItem('products', JSON.stringify(existingProducts));
    
    // Show success message
    alert(`Product ${formData.status === 'active' ? 'published' : 'saved as draft'} successfully!`);
    
    // Reset form
    setFormData({
      productName: '',
      category: '',
      subcategory: '',
      description: '',
      shortDescription: '',
      price: '',
      comparePrice: '',
      costPerItem: '',
      sku: '',
      barcode: '',
      trackQuantity: true,
      quantity: '',
      lowStockThreshold: '',
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      shippingFrom: '',
      processingTime: '',
      seoTitle: '',
      seoDescription: '',
      tags: '',
      status: 'draft'
    });
    setImages([]);
    setImagePreview('');
    setCurrentStep(1);
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: 'ri-information-line' },
    { id: 2, title: 'Pricing & Inventory', icon: 'ri-price-tag-3-line' },
    { id: 3, title: 'Shipping & Details', icon: 'ri-truck-line' },
    { id: 4, title: 'SEO & Publish', icon: 'ri-search-line' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/seller-dashboard" 
              className="text-gray-600 hover:text-gray-900"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-1">Create a new product listing for your store</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  <i className={step.icon}></i>
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Product Images */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Product Images</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Image Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex items-center justify-center bg-gray-50">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="text-center">
                          <i className="ri-image-line text-4xl text-gray-400 mb-2"></i>
                          <p className="text-sm text-gray-500">No image selected</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-600 mb-1">Click to upload images</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </label>
                    </div>

                    {/* Image Thumbnails */}
                    {images.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Product ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-emerald-500"
                              onClick={() => setImagePreview(img)}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <i className="ri-close-line text-sm"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <Input
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={!formData.category}
                    >
                      <option value="">Select subcategory</option>
                      {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <Input
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      placeholder="Brief product description (max 160 characters)"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/160 characters</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Detailed product description, features, materials, care instructions..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Inventory */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing & Inventory</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compare at Price (USD)
                  </label>
                  <Input
                    type="number"
                    value={formData.comparePrice}
                    onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost per Item (USD)
                  </label>
                  <Input
                    type="number"
                    value={formData.costPerItem}
                    onChange={(e) => handleInputChange('costPerItem', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Product SKU"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="trackQuantity"
                      checked={formData.trackQuantity}
                      onChange={(e) => handleInputChange('trackQuantity', e.target.checked.toString())}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="trackQuantity" className="text-sm font-medium text-gray-700">
                      Track quantity
                    </label>
                  </div>
                </div>

                {formData.trackQuantity === 'true' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <Input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low Stock Threshold
                      </label>
                      <Input
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                        placeholder="5"
                        min="0"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Shipping & Details */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping & Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ships From *
                  </label>
                  <select
                    value={formData.shippingFrom}
                    onChange={(e) => handleInputChange('shippingFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select location</option>
                    <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                    <option value="Accra, Ghana">Accra, Ghana</option>
                    <option value="Nairobi, Kenya">Nairobi, Kenya</option>
                    <option value="Cape Town, South Africa">Cape Town, South Africa</option>
                    <option value="Cairo, Egypt">Cairo, Egypt</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
                      placeholder="Length"
                      step="0.1"
                      min="0"
                    />
                    <Input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
                      placeholder="Width"
                      step="0.1"
                      min="0"
                    />
                    <Input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
                      placeholder="Height"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Time
                  </label>
                  <select
                    value={formData.processingTime}
                    onChange={(e) => handleInputChange('processingTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select processing time</option>
                    <option value="1-2 business days">1-2 business days</option>
                    <option value="3-5 business days">3-5 business days</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="Custom order">Custom order</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: SEO & Publish */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO & Publish</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <Input
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    placeholder="SEO-friendly title for search engines"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Meta description for search engines"
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Comma-separated tags (e.g., handmade, african, traditional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  variant="outline"
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({ ...formData, status: 'draft' });
                  handleSubmit(new Event('submit') as any);
                }}
              >
                Save as Draft
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Next
                  <i className="ri-arrow-right-line ml-2"></i>
                </Button>
              ) : (
                <Button 
                  type="submit"
                  onClick={() => setFormData({ ...formData, status: 'active' })}
                >
                  <i className="ri-check-line mr-2"></i>
                  Publish Product
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
