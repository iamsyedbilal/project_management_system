class ApiResponse {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: unknown;

  constructor(statusCode: number, message: string, data: unknown = null) {
    this.success = statusCode >= 200 && statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
