import validator from "validator";

const RESERVED_WORDS = ["api", "admin", "login", "dashboard", "static", "stats", "url"];

/**
 * Validates the long URL. 
 * Rejects localhost, 127.0.0.1, private IPs, javascript:, data: protocols.
 */
export const isValidOriginalUrl = (url) => {
  if (!url || url.length > 2048) return false;

  // Basic format and protocol checks
  if (!validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    host_blacklist: ['localhost', '127.0.0.1']
  })) {
    return false;
  }

  // Prevent javascript or data payloads
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.startsWith("javascript:") || lowerUrl.startsWith("data:")) return false;

  return true;
}

/**
 * Validates custom alias rules (alphanumeric, no reserved words, max len 50)
 */
export const isValidCustomAlias = (alias) => {
  if (!alias) return true; // Optional

  if (alias.length > 50) return false;
  if (!validator.isAlphanumeric(alias)) return false;
  
  if (RESERVED_WORDS.includes(alias.toLowerCase())) return false;

  return true;
}
