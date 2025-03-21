import { dbConnect } from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user:User=session?.user as User;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  // console.log(_user);
  const userId =new mongoose.Types.ObjectId(_user.id);
//  console.log(userId);

    try {
    const user = await Usermodel.aggregate([
      { $match: { _id:userId } },
      { $unwind: {path:'$messages',preserveNullAndEmptyArrays: true }},
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();
    
    // console.log(user)
    if (!user || user.length === 0) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }
    return Response.json(
      {success:true, messages: user[0].messages},
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}