import { resend } from "@/lib/resend";
import { APIResponse } from "@/types/Apiresponse";
import VerificationEmail from "../../emails/verificationEmails";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<APIResponse>{
 try {
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'mystery app | Verification Code',
        react: VerificationEmail({username,otp:verifyCode}),
      });

    return {success:true,message:'Succesfully send verification email'}
    
 } catch (emailerror) {
    console.log('Falied to send verification email',emailerror);
    return {success:false,message:'Failed to send verification email'}
 }
}