import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcryptjs from 'bcryptjs'
// import { User } from "lucide";





export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username, email,password}=await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }

        const existungUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existungUserByEmail){
            if(existungUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist with this"
                },{status:400})
        }else{
            const hashedPassword = await bcryptjs.hash(password,10)
            existungUserByEmail.password=hashedPassword;
            existungUserByEmail.verifyCode=verifyCode;
            existungUserByEmail.verifyCodeExpiry= new Date(Date.now() + 3600000)

            await existungUserByEmail.save()
        }
    
    
    
    
    }else{
            const hashedPassword = await bcryptjs.hash(password, 10)
            const expiryDate =  new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })

            await newUser.save()
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500}
        )}
        
        return Response.json({
            success:true,
            message:"User Registered Successfully, Please verify email"
        },{status:200}
        )
    
    } catch (error) {
        console.error('Error Registring user: ', error);
        return Response.json({
            success:false,
            message: "Error registering User"
        },{
            status:500
        })
        
    }
}