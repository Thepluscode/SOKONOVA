"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface ServiceDetailProps {
  service: any;
  userId?: string;
  onPurchase: (data: { buyerId: string; sellerId: string; message: string; price: number; currency: string }) => Promise<any>;
}

export function ServiceDetail({ service, userId, onPurchase }: ServiceDetailProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    if (!userId) {
      // Redirect to login
      window.location.href = `/auth/login?callbackUrl=/services/${service.id}`;
      return;
    }
    
    if (!message.trim()) {
      setError("Please provide a message for the seller.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    
    try {
      await onPurchase({
        buyerId: userId,
        sellerId: service.sellerId,
        message,
        price: service.price,
        currency: service.currency,
      });
      
      setSuccess(true);
      setMessage("");
      setTimeout(() => {
        setIsDialogOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Could not purchase service. Please try again.");
      console.error("Purchase error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-start gap-6">
          <div className="relative w-20 h-20 rounded-full border border-border bg-background overflow-hidden flex-shrink-0">
            {service.seller?.shopLogoUrl ? (
              <Image
                src={service.seller.shopLogoUrl}
                alt={service.seller.shopName || "Seller"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-semibold">
                {(service.seller?.shopName || "S")[0]?.toUpperCase()}
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold">{service.title}</h1>
            <p className="text-muted-foreground">
              Offered by <span className="font-medium">{service.seller?.shopName || "Seller"}</span>
            </p>
            
            <div className="flex items-center gap-4 mt-2">
              {service.seller?.ratingAvg && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{service.seller.ratingAvg.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({service.seller.ratingCount} reviews)
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Delivery in {service.deliveryTime} days</span>
              </div>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Service Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{service.description}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About the Seller</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full border border-border bg-background overflow-hidden">
                {service.seller?.shopLogoUrl ? (
                  <Image
                    src={service.seller.shopLogoUrl}
                    alt={service.seller.shopName || "Seller"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-semibold">
                    {(service.seller?.shopName || "S")[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{service.seller?.shopName || "Seller"}</h3>
                {service.seller?.ratingAvg && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{service.seller.ratingAvg.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({service.seller.ratingCount} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>
              {service.currency} {service.price.toFixed(2)}
            </CardTitle>
            <CardDescription>
              Delivery in {service.deliveryTime} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  Purchase Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Purchase Service</DialogTitle>
                </DialogHeader>
                
                {success ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 text-2xl">✓</span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Order Placed!</h3>
                    <p className="text-muted-foreground">
                      Your service request has been sent to the seller. They will contact you soon.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-medium">{service.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.currency} {service.price.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message for Seller</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Provide details about your requirements..."
                        rows={4}
                        required
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
                        variant="ghost"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePurchase}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Confirm Purchase"}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
