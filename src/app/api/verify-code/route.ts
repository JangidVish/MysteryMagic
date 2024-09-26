import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username, code}=await request.json()

        const decodedUsername=decodeURIComponent(username)
        // console.log(decodedUsername);
        const user = await UserModel.findOne({
            username:decodedUsername
        })
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:400})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true
            await user.save()

            return Response.json({
                success:true,
                message:"User Verified Successfully"
            },{status:200})
        }
        else if(!isCodeValid){
            return Response.json({
                success:false,
                message:"Verification Code incorrect"
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"Verification Code expired please signup again to verification code"
            },{status:400})
        }



    } catch (error) {
        console.log("Error verifing code "+ error);
        return Response.json({
            success:false,
            message:"Error while verifing code"
        },{status:500})
    }
}