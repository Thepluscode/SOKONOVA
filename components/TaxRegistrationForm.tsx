"use client";

import { useState } from "react";
import { submitTaxRegistration } from "@/lib/api/trust";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface TaxRegistrationFormProps {
  sellerId: string;
  onRegistrationSuccess: () => void;
}

export function TaxRegistrationForm({ sellerId, onRegistrationSuccess }: TaxRegistrationFormProps) {
  const [taxId, setTaxId] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taxId.trim() || !country.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      await submitTaxRegistration(sellerId, { taxId, country });
      setSuccess(true);
      onRegistrationSuccess();
    } catch (err) {
      setError("Failed to submit tax registration. Please try again.");
      console.error("Tax registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-lg">
        <p className="font-medium">Tax registration submitted successfully!</p>
        <p className="text-sm">
          {"Your registration is under review. We'll notify you once it's approved."}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium mb-1">
              Tax ID *
            </label>
            <input
              id="taxId"
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder="Enter your tax identification number"
              required
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">
              Country *
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder="Enter your country"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Tax Registration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
