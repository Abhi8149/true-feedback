import { dbConnect } from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { User } from "next-auth";


export async function POST(request:Request){
  await dbConnect();
  
  const session=await getServerSession(authOptions);

  if(!session || !session.user){
    return Response.json({
        success:false,
        message:'User session does not exist'
    },{status:404}
    )
  }
  
  const user:User=session?.user as User;
  const userId=user.id;
  try {
    const {acceptingmessage}=await request.json();
    const updateduser=await Usermodel.findByIdAndUpdate(
        userId,
        {isAccepetingMessage:acceptingmessage},
        {new:true}
    );
    if(!updateduser){
        return Response.json(
            {success:false,message:'User does not exist'},
            {status:404}
        )
    }
    return Response.json(
        {success:true,message: 'Message acceptance status updated successfully',updateduser},
        {status:200},    
    )

  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
}

export async function GET(){
    await dbConnect();
  
    const session=await getServerSession(authOptions);
  //  console.log(session?.user)
    if(!session || !session.user){
      return Response.json({
          success:false,
          message:'User session does not exist'
      },{status:403}
      )
    }
    
    const user:User=session?.user as User;
    const userId=user.id;
    try {
    const newuser=await Usermodel.findById({_id:userId});
    if(!newuser){
        return Response.json({
            success:false,
            message:'User does not exist'
        },{status:404}
        )
    }    
    
    return Response.json(
        {
          success: true,
          isAcceptingMessages: newuser.isAccepetingMessage,
        },
        { status: 200 }
      );

    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
          { success: false, message: 'Error retrieving message acceptance status' },
          { status: 500 }
        );
    }

}