import { Response } from "./response";
export class DataResponse<T> extends Response {
  data: T;
  constructor(message: Array<string>, code: number, data: T) {
    super(message, code);
    this.data = data;
  }
}