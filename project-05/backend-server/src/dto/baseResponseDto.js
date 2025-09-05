/**
 * Base Response DTO for API responses
 */
class BaseResponseDto {
  constructor(success = true, data = null, error = null, message = null) {
    this.success = success;
    this.timestamp = new Date().toISOString();

    if (data !== null) this.data = data;
    if (error !== null) this.error = error;
    if (message !== null) this.message = message;
  }

  static success(data, message = null) {
    return new BaseResponseDto(true, data, null, message);
  }

  static error(error, message = null) {
    return new BaseResponseDto(false, null, error, message);
  }
}

module.exports = BaseResponseDto;
