import { BaseError } from "./errorHandler";

export class Success {
  data: any;
  success: boolean;

  constructor(data: any, success: boolean = true) {
    this.data = data;
    this.success = success;
  }
}

export class APIError extends BaseError {
  constructor(
    name: string,
    statusCode: number = 500,
    message: string = "internal server error"
  ) {
    super(name, statusCode, message);
  }
}
