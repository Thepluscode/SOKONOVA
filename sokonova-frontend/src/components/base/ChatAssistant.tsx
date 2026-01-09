"use client";

import { useState, useRef, useEffect } from "react";
import { askProductQuestion } from "@/lib/api/chat";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface RelatedProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  ratingAvg: number;
  shopName: string;
}

interface ChatAssistantProps {
  userId: string;
  productId: string;
  productName: string;
}

export function ChatAssistant({ userId, productId, productName }: ChatAssistantProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: question,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);
    setError("");
    
    try {
      const response = await askProductQuestion(userId, productId, question);
      
      // Add assistant message to chat
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.answer,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Set related products if available
      if (response.relatedProducts) {
        setRelatedProducts(response.relatedProducts);
      }
    } catch (err) {
      setError("Failed to get answer. Please try again.");
      console.error("Chat error:", err);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What are the product details?",
    "How much does it cost?",
    "Is it in stock?",
    "What do customers say?",
    "How does it compare to similar products?"
  ];

  return (
    <div className="mt-8 border-t border-border pt-8">
      <h3 className="text-xl font-semibold mb-4">Product Assistant</h3>
      
      <div className="bg-card rounded-lg border border-border">
        {/* Chat messages container */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <p className="mb-4">Ask me anything about <strong>{productName}</strong></p>
              <p className="text-sm">I can help with product details, pricing, availability, reviews, and comparisons.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-lg p-3 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="px-4 pb-2">
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {/* Quick questions */}
        {messages.length === 0 && (
          <div className="px-4 py-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(q)}
                  className="text-xs px-2 py-1 bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input form */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`Ask about ${productName}...`}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Asking..." : "Send"}
            </button>
          </form>
          
          <div className="mt-3 text-xs text-muted-foreground">
            <p>{'Examples: "What size is this?", "How long does shipping take?", "Is this returnable?"'}</p>
          </div>
        </div>
      </div>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-3">You might also like</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedProducts.map((product) => (
              <div key={product.id} className="border border-border rounded-lg p-3 hover:shadow-card transition-shadow">
                <h5 className="font-medium text-sm line-clamp-2">{product.title}</h5>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold">
                    {product.currency} {product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center text-xs">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{product.ratingAvg || 'N/A'}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{product.shopName}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
