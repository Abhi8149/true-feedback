
import { dbConnect } from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    const {username,content}=await request.json();

    try {
        const user=await Usermodel.findOne({username});
        if(!user){
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
              );
        }

        if(user.isAccepetingMessage==false){
            return Response.json(
                { message: 'User is not accepting message', success: false },
              );
        }
        
        const newmessage={content, createdAt:new Date()}
        user.messages.push(newmessage as message);
        await user.save();
        
        return Response.json(
            { message: 'message sent succefully', success: true },
            { status: 200 }
          );

    } catch (error) {
        console.error(error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
          );
    }
    




}