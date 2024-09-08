import { DataResponse } from "src/domain/data.response";
import { ErrorResponse } from "src/domain/error.response";
import { Response } from "src/domain/response";

export function returnSuccessMessage(message:Array<string>, statusCode:number, data:any){
  return new DataResponse(message, statusCode, data);
};
export function returnErrorMessage(message:Array<string>, statusCode:number, error:string){
  return new ErrorResponse(message, statusCode, error);
};
export function returnInfoMessage(message:Array<string>, statusCode:number){
  return new Response(message, statusCode);
};