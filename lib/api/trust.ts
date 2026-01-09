// lib/api/trust.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get seller quality score and trust metrics
 */
export async function getSellerQualityScore(sellerId: string) {
  return apiFetch(`${apiBase}/trust/sellers/${sellerId}/quality-score`);
}

/**
 * Get dispute shield metrics for a seller
 */
export async function getSellerDisputeShield(sellerId: string) {
  return apiFetch(`${apiBase}/trust/sellers/${sellerId}/dispute-shield`);
}

/**
 * Get reputation graph data for a seller
 */
export async function getSellerReputationGraph(sellerId: string) {
  return apiFetch(`${apiBase}/trust/sellers/${sellerId}/reputation-graph`);
}

/**
 * Get full reputation graph data for a seller with all metrics
 */
export async function getSellerFullReputationGraph(sellerId: string) {
  return apiFetch(`${apiBase}/trust/sellers/${sellerId}/full-reputation-graph`);
}

/**
 * Get compliance status for a seller
 */
export async function getSellerComplianceStatus(sellerId: string) {
  return apiFetch(`${apiBase}/trust/sellers/${sellerId}/compliance`);
}

/**
 * Submit KYC documents for a seller
 */
export async function submitKYCDocuments(
  sellerId: string,
  data: {
    documentType: string;
    documentNumber: string;
    documentUrl: string;
    country: string;
  }
) {
  return apiFetch(`${apiBase}/trust/sellers/${sellerId}/kyc`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Submit tax registration for a seller
 */
export async function submitTaxRegistration(
  sellerId: string,
  data: {
    taxId: string;
    country: string;
  }
) {
  return apiFetch(`${apiBase}/trust/sellers/${sellerId}/tax-registration`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get counterfeit detection results for a product
 */
export async function getProductCounterfeitScan(productId: string) {
  return apiFetch(`${apiBase}/trust/products/${productId}/counterfeit-scan`);
}

/**
 * Report potential counterfeit product
 */
export async function reportCounterfeitProduct(
  data: {
    reporterId: string;
    productId: string;
    reason: string;
    evidenceUrl?: string;
  }
) {
  return apiFetch(`${apiBase}/trust/products/report-counterfeit`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get admin trust dashboard metrics
 */
export async function getAdminTrustDashboard(adminId: string) {
  return apiFetch(`${apiBase}/trust/admin/${adminId}/dashboard`);
}

/**
 * Get seller risk assessment
 */
export async function getSellerRiskAssessment(sellerId: string) {
  return apiFetch(`${apiBase}/trust/sellers/${sellerId}/risk-assessment`);
}