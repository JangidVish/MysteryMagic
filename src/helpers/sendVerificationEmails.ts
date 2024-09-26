import { resend } from "@/lib/resend";
// import { Resend } from "resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiRespones";

// const resend = new Resend('re_123456789');
export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'mystry@message.dev',
            to: email,
            subject: 'Mystry Message | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        console.log('Email send response:', response);

        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return { success: false, message: 'Failed to send verification email' };
    }
}
