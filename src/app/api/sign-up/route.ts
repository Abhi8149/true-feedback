import { dbConnect } from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerifictationemail";
import Usermodel from "@/model/User";
import * as bcrypt from 'bcrypt';

export async function POST(request:Request){
    // console.log('Request body:', await request.json());
    await dbConnect()
    try {
        const {username,email,password}=await request.json();
        // console.log(password)
        const existingVerifiedUserByUsername=await Usermodel.findOne({
            email,
            isVerified:true
        })
        console.log(existingVerifiedUserByUsername);
        if(existingVerifiedUserByUsername){
          return Response.json({
            success:false,
            message:'user already exist'
          });
        }
        //Here comes two conditions
        //Either the user is visiing first time and he is not registered yet
        //Or the user is visiting second time and he is already registered but not verified yet
        const exisitingUserByEmail=await Usermodel.findOne({email});
        //This generated the verifcation code of 6 digits
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(exisitingUserByEmail){
            //User is visiting second time and he is already registered but not verified yet
            if(exisitingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:'user already exist with this email'
                })
            }
            
                exisitingUserByEmail.password=await bcrypt.hash(password,10);
                exisitingUserByEmail.verifycode=verifyCode;
                exisitingUserByEmail.verifycodeExpiry=new Date(Date.now()+3600000)
                
                await exisitingUserByEmail.save();

            
        }
        
            //User is visiting first time and he is not registered yet
            const hashedpassword=(await bcrypt.hash(password,10)).toString();
            let expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1)

            const newuser=await Usermodel.create({
                username,
                email,
                password:hashedpassword,
                verifycode:verifyCode,
                isVerified:false,
                verifycodeExpiry:expiryDate,
                isAccepetingMessage:false,
                messages:[]
            })
            
            await newuser.save();
        

        //chahe user verified ho ya chahe naha hu verification email to jayega hi
        const emailresponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailresponse.success){
            return Response.json({
                success:false,
                message:emailresponse,
            },{status:500})
        }

        return Response.json({
            success:true,
            message:'User registeration succefully please verify you account',
        },{status:201})
        
    } catch (error) {
        console.log('Failed to registed the user',error);
        return Response.json({
            success:false,
            message:'Failed to registed the user',
        },{status:500});
    }
}

