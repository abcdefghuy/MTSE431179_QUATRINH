const BaseResponseDto = require("./baseResponseDto");

/**
 * List Response DTO (without pagination)
 */
class ListResponseDto extends BaseResponseDto {
  constructor(items, totalCount, additionalMeta = null, message = null) {
    const defaultMeta = {
      totalItems: totalCount || items.length,
      itemCount: items.length,
      itemsPerPage: items.length,
      totalPages: 1,
      currentPage: 1,
    };

    // Pass items directly as data (no wrapper)
    super(true, items, null, message);

    // Add meta outside of data
    this.meta = { ...defaultMeta, ...(additionalMeta || {}) };
  }

  static create(items, additionalMeta = null, message = null) {
    return new ListResponseDto(items, items.length, additionalMeta, message);
  }
}

module.exports = ListResponseDto;
