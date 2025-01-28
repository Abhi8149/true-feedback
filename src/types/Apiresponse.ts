import { message } from "@/model/User"

export interface APIResponse{
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean,
    messages?:Array<message>
}