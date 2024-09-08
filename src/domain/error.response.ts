import { Response } from "./response";
export class ErrorResponse extends Response {
    error: string;
    constructor(message: Array<string>, code: number, error: string) {
        super(message, code);
        this.error = error;
    }
}