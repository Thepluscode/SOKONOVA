"use client";

import { useState } from "react";
import { createCommunityStory } from "@/lib/api/social";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ShareProductProps {
  userId: string;
  productId: string;
  productName: string;
  productImage?: string;
}

export function ShareProduct({ userId, productId, productName, productImage }: ShareProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    
    try {
      await createCommunityStory(userId, productId, content, imageUrl);
      setSuccess(true);
      setContent("");
      setImageUrl("");
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Could not share your story. Please try again.");
      console.error("Share error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Share Your Experience</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
        </DialogHeader>
        
        {success ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Story Shared!</h3>
            <p className="text-muted-foreground">Thank you for sharing your experience with the community.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <div className="flex items-center gap-3 p-3 rounded-md border bg-muted/50">
                {productImage && (
                  <div className="relative w-12 h-12 rounded-md overflow-hidden">
                    <img
                      src={productImage}
                      alt={productName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{productName}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Your Story</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell us about your experience with this product..."
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? "Sharing..." : "Share Story"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
