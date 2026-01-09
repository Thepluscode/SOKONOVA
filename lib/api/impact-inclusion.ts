// lib/api/impact-inclusion.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get impact metrics
 */
export function getImpactMetrics(adminId: string) {
  return apiFetch(`${apiBase}/impact-inclusion/metrics?adminId=${adminId}`);
}

/**
 * Get diversity metrics
 */
export function getDiversityMetrics(adminId: string) {
  return apiFetch(`${apiBase}/impact-inclusion/diversity?adminId=${adminId}`);
}

/**
 * Get sustainability metrics
 */
export function getSustainabilityMetrics(adminId: string) {
  return apiFetch(`${apiBase}/impact-inclusion/sustainability?adminId=${adminId}`);
}

/**
 * Get community impact
 */
export function getCommunityImpact(adminId: string) {
  return apiFetch(`${apiBase}/impact-inclusion/community?adminId=${adminId}`);
}