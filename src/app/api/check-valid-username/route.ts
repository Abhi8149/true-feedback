import { dbConnect } from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import {z} from 'zod';
import { Uservalidation } from "@/Schema/signUpSchema";

const UsernameQuerySchema = z.object({
    username: Uservalidation,
  });

export async function GET(request:Request){
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
    
    const queryparams={
        username:searchParams.get('username')
    }

    const result=UsernameQuerySchema.safeParse(queryparams);

    if(!result.success){
        return Response.json({
            success:false,
            message:"Invalid query"
        })
    }
    const {username}=result.data;
    const user=await Usermodel.findOne({
        username:username,
        isVerified:true
    })

    if(user){
          return Response.json({
            success:false,
            message:"Username already taken"
          })
    }

    return Response.json({
        success:true,
        message:"Username available"
    })
   
    } catch (error) {
        console.error(error);
        return Response.json({
            success:false,
            message:'Invalid username',error
        },
        {status:500}
    )
    }

}