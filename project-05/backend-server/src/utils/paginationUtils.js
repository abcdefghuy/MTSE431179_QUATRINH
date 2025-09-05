/**
 * Pagination utilities
 */
class PaginationUtils {
  /**
   * Parse and validate pagination parameters
   * @param {Object} query - Query parameters from request
   * @param {Object} options - Default options
   * @returns {Object} Validated pagination parameters
   */
  static parsePaginationParams(query = {}, options = {}) {
    const defaults = {
      maxLimit: 50,
      defaultLimit: 10,
      defaultOffset: 0,
      defaultSortBy: "createdAt",
      defaultSortOrder: "desc",
    };

    const config = { ...defaults, ...options };

    const limit = Math.min(
      Math.max(parseInt(query.limit) || config.defaultLimit, 1),
      config.maxLimit
    );

    const offset = Math.max(parseInt(query.offset) || config.defaultOffset, 0);

    const sortBy = query.sortBy || config.defaultSortBy;
    const sortOrder = ["asc", "desc"].includes(query.sortOrder)
      ? query.sortOrder
      : config.defaultSortOrder;

    // Build MongoDB sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    return {
      limit,
      offset,
      sortBy,
      sortOrder,
      sort,
    };
  }

  /**
   * Parse page-based pagination (alternative to offset-based)
   * @param {Object} query - Query parameters from request
   * @param {Object} options - Default options
   * @returns {Object} Validated pagination parameters with offset calculated
   */
  static parsePageBasedPagination(query = {}, options = {}) {
    const defaults = {
      maxLimit: 50,
      defaultLimit: 10,
      defaultPage: 1,
      defaultSortBy: "createdAt",
      defaultSortOrder: "desc",
    };

    const config = { ...defaults, ...options };

    const limit = Math.min(
      Math.max(
        parseInt(query.limit) || parseInt(query.size) || config.defaultLimit,
        1
      ),
      config.maxLimit
    );

    const page = Math.max(parseInt(query.page) || config.defaultPage, 1);
    const offset = (page - 1) * limit;

    const sortBy = query.sortBy || config.defaultSortBy;
    const sortOrder = ["asc", "desc"].includes(query.sortOrder)
      ? query.sortOrder
      : config.defaultSortOrder;

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    return {
      limit,
      offset,
      page,
      sortBy,
      sortOrder,
      sort,
    };
  }
}

/**
 * Validation utilities
 */
class ValidationUtils {
  /**
   * Validate MongoDB ObjectId
   * @param {string} id - ID to validate
   * @returns {boolean}
   */
  static isValidObjectId(id) {
    return id && typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/);
  }

  /**
   * Validate required fields
   * @param {Object} data - Data to validate
   * @param {Array} requiredFields - Array of required field names
   * @returns {Object} { isValid: boolean, missingFields: Array }
   */
  static validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(
      (field) =>
        data[field] === undefined || data[field] === null || data[field] === ""
    );

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Sanitize and validate sort fields
   * @param {string} sortBy - Sort field
   * @param {Array} allowedFields - Array of allowed sort fields
   * @returns {string} Validated sort field
   */
  static validateSortField(sortBy, allowedFields = []) {
    if (!allowedFields.length) return sortBy;

    return allowedFields.includes(sortBy) ? sortBy : allowedFields[0];
  }
}

module.exports = {
  PaginationUtils,
  ValidationUtils,
};
