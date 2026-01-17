class ApiResponse {
  constructor(statusCode, message, data, meta = {}) {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
    this.meta = meta
  }
}

export { ApiResponse }
