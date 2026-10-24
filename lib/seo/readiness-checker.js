/**
 * Jaipur Stonecraft — Product SEO Readiness & Quality Checker
 * 
 * Powered by the Product Intelligence Engine (PIE).
 * Evaluates the full 30-check suite across Data Integrity, Content Quality,
 * Technical SEO, Media Accessibility, and GEO/AEO & Trust.
 */

import {
  evaluateProductIntelligence,
  APPROVED_STONE_MATERIALS,
  FORBIDDEN_STONE_TERMS,
  PIE_RULE_STATUS,
  PIE_DIMENSIONS,
  DEFAULT_SEO_AUDIT_CONFIG
} from "./product-intelligence-engine.js";

export {
  evaluateProductIntelligence,
  APPROVED_STONE_MATERIALS,
  FORBIDDEN_STONE_TERMS,
  PIE_RULE_STATUS,
  PIE_DIMENSIONS,
  DEFAULT_SEO_AUDIT_CONFIG
};

/**
 * Evaluates product SEO and quality readiness.
 * Wraps evaluateProductIntelligence for backward compatibility.
 * 
 * @param {Object} product - Product data object
 * @param {Object} [options] - Additional evaluation options
 * @returns {Object} Comprehensive evaluation report
 */
export function evaluateSeoReadiness(product = {}, options = {}) {
  return evaluateProductIntelligence(product, options);
}

export default evaluateSeoReadiness;

