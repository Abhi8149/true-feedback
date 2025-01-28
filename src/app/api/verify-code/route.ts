import { dbConnect } from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import {z} from 'zod';
import { verifycodeschema } from "@/Schema/verifySchema";

const userverifycode=z.object({
    code:verifycodeschema
})

export async function POST(request:Request){
    await dbConnect()
    try {
        const {username,verifycode}=await request.json();
        const decodedusername=decodeURIComponent(username)
        const user=await Usermodel.findOne({username:decodedusername});
        if(!user){
            return Response.json({
                success:false,
                message:'User does not exist with this username'
            },
            {
             status:500
            }
        )
        }
        const isVerifieduser=user.verifycode===verifycode;
        const isNotExpired= new Date(user.verifycodeExpiry) > new Date();
    
        if(!isVerifieduser){
            return Response.json({
                success:false,
                message:'Invalid verification code'
            },{status:400})
        }
    
        if(!isNotExpired){
            return Response.json({
                success:false,
                message:'Code expired'
            })
        }
        
        user.isVerified=true;
        await user.save();
        return Response.json({
            success:true,
            message:'User verified',
        },{status:200})   
    } catch (error:any) {
       return Response.json({
        success:false,
        message:error.message
       },{status:500})
    }


}