const BaseResponseDto = require("./baseResponseDto");

/**
 * Single Item Response DTO
 */
class ItemResponseDto extends BaseResponseDto {
  constructor(item, meta = null, message = null) {
    const data = {
      item,
      ...(meta && { meta }),
    };

    super(true, data, null, message);
  }

  static create(item, meta = null, message = null) {
    return new ItemResponseDto(item, meta, message);
  }
}

module.exports = ItemResponseDto;
