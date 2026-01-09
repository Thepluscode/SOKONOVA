"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";

interface CounterfeitDetectionResultsProps {
  productId: string;
  productName: string;
  riskScore: number;
  isCounterfeit: boolean;
  confidence: string;
  detectedIssues: string[];
  recommendations: string[];
  imageAnalysis: {
    url: string;
    scanned: boolean;
    detectedBrands: string[];
    similarityScore: number;
    qualityScore: number;
  } | null;
}

export function CounterfeitDetectionResults({
  productId,
  productName,
  riskScore,
  isCounterfeit,
  confidence,
  detectedIssues,
  recommendations,
  imageAnalysis
}: CounterfeitDetectionResultsProps) {
  // Determine risk level based on risk score
  const getRiskLevel = (score: number) => {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    if (score >= 40) return "low";
    return "minimal";
  };

  // Get color for risk level
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const riskLevel = getRiskLevel(riskScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counterfeit Detection Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg">{productName}</h3>
            <p className="text-sm text-muted-foreground">Product ID: {productId}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Risk Score</div>
              <div className="text-2xl font-bold">{riskScore}/100</div>
              <Badge className={getRiskColor(riskLevel)}>{riskLevel} risk</Badge>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Confidence</div>
              <div className="text-2xl font-bold capitalize">{confidence}</div>
              <div className="text-sm text-muted-foreground">
                {isCounterfeit ? 'Likely Counterfeit' : 'Authentic'}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Issues Found</div>
              <div className="text-2xl font-bold">{detectedIssues.length}</div>
              <div className="text-sm text-muted-foreground">Potential problems</div>
            </div>
          </div>

          {imageAnalysis && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Image Analysis</h4>
              <div className="flex items-center gap-4">
                <img 
                  src={imageAnalysis.url} 
                  alt="Product" 
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Similarity Score:</span>
                      <span className="ml-2 font-medium">
                        {(imageAnalysis.similarityScore * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quality Score:</span>
                      <span className="ml-2 font-medium">
                        {imageAnalysis.qualityScore.toFixed(1)}/100
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Detected Brands:</span>
                      <span className="ml-2">
                        {imageAnalysis.detectedBrands.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {detectedIssues.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Detected Issues</h4>
              <ul className="space-y-2">
                {detectedIssues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    <span className="text-sm">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}