import { dbConnect } from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

export async function DELETE(request:Request, {params}:{params:{messageId:string}}){
      await dbConnect();
      const session = await getServerSession(authOptions);
      const user:User=session?.user as User;
    
      if (!session || !user) {
        return Response.json(
          { success: false, message: 'Not authenticated' },
          { status: 401 }
        );
      }
      const messageId=params.messageId
      const userId=user.id
      try {
        const updatedUser=await Usermodel.updateOne(
          { _id: userId },
          { $pull: { messages: { _id: messageId } } },
        )
        if(updatedUser.modifiedCount==0){
          return Response.json(
            { success: false, message: 'message already deleted or cannot able to delete' },
            { status: 401 }
          );
        }

        return Response.json(
          { success: true, message: 'message deleted succesfully' },
          { status: 200 }
        );
      } catch (error:any) {
        console.log(error)
        return Response.json(
          { success: false, message: error.message },
          { status: 401 }
        );
      }
}