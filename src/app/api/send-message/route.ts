import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request:Request) {
    await dbConnect()

    const {username, content}=await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"No user found"
            },{status:404})
        }
        
        //is user accepting the message
        if(!user.isAcceptingMessages){
        console.log(user.isAcceptingMessages);

            return Response.json({
                success:false,
                message:"User is not accepting Message"
            },{status:403})
        }

        const newMessage = {content, createdAt: new Date()}
        user.message.push(newMessage as Message)
        await user.save()

        return Response.json({
            success:true,
            message:"Message Sent Successfully"
        },{status:200})
    } catch (error) {
        console.log("Error while sending message ", error);
        
        return Response.json({
            success:false,
            message:"Error while sending message"
        },{status:500})
    }
}

