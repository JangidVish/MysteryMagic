import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
          id: "credentials",
          name: "Credentials",
          credentials:{
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
          },

          
          async authorize(credentials:any):Promise<any> {
            
            await dbConnect()
            try {
              const user = await UserModel.findOne({
                $or:[
                  {email: credentials.identifier},
                  {username: credentials.identifier}
                ]
              })
              if(!user){
                
                throw new Error("No user found with this email or username")
              }

              if(!user.isVerified){
                throw new Error('Please verify your account before signing in')
              }
              const isPasswordIsCorrect=await bcrypt.compare(
                credentials.password, 
                user.password
              )

              if(isPasswordIsCorrect){
                return user
              }else{
                throw new Error('Incorrect password')
              }

            } catch (error:any) {
              throw new Error(error.message || "Error during authentication")
            }
          
        }
        }),
         GoogleProvider({
           clientId: process.env.GOOGLE_CLIENT_ID ?? "",
           clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
         GitHubProvider({
           clientId: process.env.GITHUB_ID ?? "",
           clientSecret: process.env.GITHUB_SECRET ?? ""
         })
    ],
    callbacks:{
      async jwt({ token, user }) {
        // console.log(user);
        
        if(user){
          token._id= user._id?.toString()
          token.isVerified= user.isVerified
          token.isAcceptingMessages= user.isAcceptingMessages
          token.username= user.username
        }
        return token
      },
      async session({ session, token }) {
        if(token){
          session.user._id = token._id
          session.user.isVerified=token.isVerified
          session.user.isAcceptingMessages=token.isAcceptingMessages
          session.user.username= token.username
        }
        
        return session
      }
    },
    session:{
      strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
      signIn: '/sign-in'
    }
    
    
}