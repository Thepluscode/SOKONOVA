"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { getProductCounterfeitScan } from "@/lib/api/trust";

interface CounterfeitReport {
  id: string;
  reporter: {
    name: string;
  };
  product: {
    id: string;
    title: string;
    imageUrl?: string;
  };
  reason: string;
  evidenceUrl?: string;
  status: string;
  createdAt: string;
}

interface CounterfeitReportReviewProps {
  report: CounterfeitReport;
  onStatusChange: (reportId: string, newStatus: string) => void;
}

export function CounterfeitReportReview({ report, onStatusChange }: CounterfeitReportReviewProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [error, setError] = useState("");

  const handleScanProduct = async () => {
    setIsScanning(true);
    setError("");
    
    try {
      const results = await getProductCounterfeitScan(report.product.id);
      setScanResults(results);
    } catch (err) {
      setError("Failed to scan product for counterfeit detection");
      console.error("Scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(report.id, newStatus);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>Counterfeit Report Review</CardTitle>
          <Badge 
            variant={
              report.status === 'PENDING_REVIEW' ? 'secondary' :
              report.status === 'UNDER_INVESTIGATION' ? 'default' :
              report.status === 'RESOLVED' ? 'outline' : 'destructive'
            }
          >
            {report.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Report Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Reported by:</span>
                  <span className="ml-2 font-medium">{report.reporter.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Reason:</span>
                  <span className="ml-2">{report.reason}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Reported on:</span>
                  <span className="ml-2">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Product</h3>
              <div className="flex items-center gap-3">
                {report.product.imageUrl && (
                  <img 
                    src={report.product.imageUrl} 
                    alt={report.product.title} 
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-medium">{report.product.title}</div>
                  <div className="text-xs text-muted-foreground">ID: {report.product.id}</div>
                </div>
              </div>
            </div>
          </div>

          {report.evidenceUrl && (
            <div>
              <h3 className="font-medium mb-2">Evidence</h3>
              <a 
                href={report.evidenceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View evidence attachment
              </a>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleScanProduct} 
              disabled={isScanning}
              variant="secondary"
            >
              {isScanning ? 'Scanning...' : 'Scan for Counterfeit'}
            </Button>
            
            <Button 
              onClick={() => handleStatusChange('UNDER_INVESTIGATION')}
              variant="outline"
            >
              Mark as Investigating
            </Button>
            
            <Button 
              onClick={() => handleStatusChange('RESOLVED')}
              variant="outline"
            >
              Mark as Resolved
            </Button>
            
            <Button 
              onClick={() => handleStatusChange('DISMISSED')}
              variant="outline"
            >
              Dismiss Report
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          {scanResults && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Counterfeit Detection Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-3 rounded">
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                  <div className="text-xl font-bold">{scanResults.riskScore}/100</div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="text-sm text-muted-foreground">Counterfeit</div>
                  <div className="text-xl font-bold">
                    {scanResults.isCounterfeit ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="text-sm text-muted-foreground">Confidence</div>
                  <div className="text-xl font-bold capitalize">{scanResults.confidence}</div>
                </div>
              </div>
              
              {scanResults.detectedIssues.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Detected Issues</h4>
                  <ul className="space-y-1">
                    {scanResults.detectedIssues.map((issue: string, index: number) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {scanResults.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {scanResults.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}