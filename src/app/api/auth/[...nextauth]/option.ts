import { dbConnect } from "@/lib/dbConnect"
import Usermodel from "@/model/User";
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions= {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
        id:'credentials',
        name:'Credentials',
        credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials:any):Promise<any> {
            await dbConnect();
            try {
            const user=await Usermodel.findOne({
                    $or:[
                       {email:credentials.identifier},
                       {username:credentials.identifier}
                    ]
                }) 

                if(!user){
                    throw new Error('User does not exits');
                }
                
                const checkpassword=await bcrypt.compare(credentials.password,user.password);
                if(!checkpassword){
                    throw new Error('Invalid password please enter the correct password');
                }

                return user;      
            } catch (error:any) {
                throw new Error(error)
            }

          }
      
    })
  ],
  callbacks: {
    async jwt({ token, user}:any) {
        if(user){
            token._id = user._id.toString(); // Convert ObjectId to string
            token.isVerified = user.isVerified;
            token.isAccepetingMessage = user.isAccepetingMessage;
            token.username = user.username;
        }
        return token;
    },
    async session({ session, token }:any) {
      if(token){
        session.user.id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAccepetingMessage = token.isAccepetingMessage;
        session.user.username = token.username;
      }
      return session
    },

},
session: {
    strategy:'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
pages: {
    signIn: '/sign-in',
  }
}

export default NextAuth(authOptions)