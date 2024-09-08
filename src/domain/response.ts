export class Response {
    message: Array<string>;
    statusCode: number;

    constructor(message: Array<string>, statusCode: number) {
        this.message = message;
        this.statusCode = statusCode;
    }
}