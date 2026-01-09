"use client";

import { useState } from "react";
import { submitKYCDocuments } from "@/lib/api/trust";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface KYCFormProps {
  sellerId: string;
  onKYCSuccess: () => void;
}

export function KYCForm({ sellerId, onKYCSuccess }: KYCFormProps) {
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentType.trim() || !documentNumber.trim() || !documentUrl.trim() || !country.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      await submitKYCDocuments(sellerId, { 
        documentType, 
        documentNumber, 
        documentUrl, 
        country 
      });
      setSuccess(true);
      onKYCSuccess();
    } catch (err) {
      setError("Failed to submit KYC documents. Please try again.");
      console.error("KYC submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-lg">
        <p className="font-medium">KYC documents submitted successfully!</p>
        <p className="text-sm">
          {"Your documents are under review. We'll notify you once they're verified."}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium mb-1">
              Document Type *
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Select document type</option>
              <option value="passport">Passport</option>
              <option value="driver_license">{"Driver's License"}</option>
              <option value="national_id">National ID</option>
              <option value="business_license">Business License</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="documentNumber" className="block text-sm font-medium mb-1">
              Document Number *
            </label>
            <input
              id="documentNumber"
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder="Enter document number"
              required
            />
          </div>
          
          <div>
            <label htmlFor="documentUrl" className="block text-sm font-medium mb-1">
              Document URL *
            </label>
            <input
              id="documentUrl"
              type="text"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder="Enter URL to uploaded document"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Please upload your document to a cloud storage service and provide the public URL
            </p>
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
            {isSubmitting ? "Submitting..." : "Submit KYC Documents"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
