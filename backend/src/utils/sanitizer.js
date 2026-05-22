/**
 * Input Sanitizer
 * Prevents XSS attacks by sanitizing user input
 * Industry best practice for security
 */

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:text\/html/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Sanitize HTML content (allows safe HTML)
 * @param {string} html - HTML string
 * @returns {string} - Sanitized HTML
 */
function sanitizeHTML(html) {
  if (typeof html !== 'string') return html;
  
  // Allowed tags
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove style tags
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove iframe
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  return sanitized;
}

/**
 * Sanitize URL to prevent XSS
 * @param {string} url - URL string
 * @returns {string} - Sanitized URL
 */
function sanitizeURL(url) {
  if (typeof url !== 'string') return '';
  
  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  
  let sanitized = url.trim();
  
  for (const protocol of dangerousProtocols) {
    if (sanitized.toLowerCase().startsWith(protocol)) {
      return '';
    }
  }
  
  // Only allow http, https, mailto
  if (!/^(https?:\/\/|mailto:|\/)/i.test(sanitized)) {
    return '';
  }
  
  return sanitized;
}

/**
 * Sanitize object recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number (basic)
 * @param {string} phone - Phone number
 * @returns {boolean} - Whether phone is valid
 */
function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's 10-15 digits (international format)
  return /^\+?[0-9]{10,15}$/.test(cleaned);
}

/**
 * Sanitize filename to prevent directory traversal
 * @param {string} filename - Filename
 * @returns {string} - Safe filename
 */
function sanitizeFilename(filename) {
  if (typeof filename !== 'string') return '';
  
  return filename
    // Remove path separators
    .replace(/[\/\\]/g, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove special characters
    .replace(/[<>:"|?*]/g, '')
    // Limit length
    .substring(0, 255)
    .trim();
}

/**
 * Escape HTML entities
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'\/]/g, char => htmlEntities[char]);
}

/**
 * Validate and sanitize form data
 * @param {Object} formData - Form data object
 * @param {Object} schema - Validation schema
 * @returns {Object} - { valid: boolean, data: sanitized data, errors: array }
 */
function validateAndSanitize(formData, schema) {
  const errors = [];
  const sanitized = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];
    
    // Required check
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    // Skip if not required and empty
    if (!rules.required && (!value || value.toString().trim() === '')) {
      sanitized[field] = '';
      continue;
    }
    
    // Type validation
    if (rules.type === 'email' && !isValidEmail(value)) {
      errors.push(`${field} must be a valid email`);
      continue;
    }
    
    if (rules.type === 'phone' && !isValidPhone(value)) {
      errors.push(`${field} must be a valid phone number`);
      continue;
    }
    
    if (rules.type === 'url') {
      const sanitizedURL = sanitizeURL(value);
      if (!sanitizedURL) {
        errors.push(`${field} must be a valid URL`);
        continue;
      }
      sanitized[field] = sanitizedURL;
      continue;
    }
    
    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`);
      continue;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} must be at most ${rules.maxLength} characters`);
      continue;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field} format is invalid`);
      continue;
    }
    
    // Sanitize based on type
    if (rules.type === 'html') {
      sanitized[field] = sanitizeHTML(value);
    } else {
      sanitized[field] = sanitizeInput(value);
    }
  }
  
  return {
    valid: errors.length === 0,
    data: sanitized,
    errors
  };
}

/**
 * Escape special regex characters to prevent ReDoS attacks.
 * Use when passing user input into a MongoDB $regex query.
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Recursively remove keys that start with '$' from an object.
 * Prevents NoSQL operator injection via user-controlled request bodies.
 * @param {*} value
 * @returns {*}
 */
function stripMongoOperators(value) {
  if (Array.isArray(value)) {
    return value.map(stripMongoOperators);
  }
  if (value !== null && typeof value === 'object') {
    const cleaned = {};
    for (const [k, v] of Object.entries(value)) {
      if (!k.startsWith('$')) {
        cleaned[k] = stripMongoOperators(v);
      }
    }
    return cleaned;
  }
  return value;
}

/**
 * Return a safe sort string that only allows known field names and a leading '-'.
 * Falls back to the provided default if the input is invalid.
 * @param {string} sort - raw sort param from req.query
 * @param {string[]} allowed - whitelisted field names
 * @param {string} defaultSort
 * @returns {string}
 */
function sanitizeSort(sort, allowed, defaultSort) {
  if (typeof sort !== 'string') return defaultSort;
  const field = sort.startsWith('-') ? sort.slice(1) : sort;
  return allowed.includes(field) ? sort : defaultSort;
}

module.exports = {
  sanitizeInput,
  sanitizeHTML,
  sanitizeURL,
  sanitizeObject,
  sanitizeFilename,
  escapeHTML,
  isValidEmail,
  isValidPhone,
  validateAndSanitize,
  escapeRegex,
  stripMongoOperators,
  sanitizeSort,
};
