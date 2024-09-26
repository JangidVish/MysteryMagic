import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from 'next-auth';
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return new Response(JSON.stringify({
            success: false,
            message: "Please Sign-in/ Not Authenticated"
        }), { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(_user._id);
    // console.log(`userId: ${userId}`);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },  // Ensure the field name matches the stored ObjectId field
            { $unwind: '$message' },
            { $sort: { 'message.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$message' } } }
        ]);

        // console.log(`User aggregation result: ${JSON.stringify(user)}`);

        if (!user || user.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "No user message found"
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            success: true,
            message: user[0].messages
        }), { status: 200 });
    } catch (error) {
        console.error(`Error while fetching messages: ${error}`);
        return new Response(JSON.stringify({
            success: false,
            message: "Error While Fetching message"
        }), { status: 500 });
    }
}
