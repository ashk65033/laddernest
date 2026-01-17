import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, service, message } = await req.json();

    // Basic validation
    if (!name || !email || !service || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    // Configure transport (use Gmail App Password or SMTP provider)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL, // your gmail address
        pass: process.env.CONTACT_EMAIL_PASSWORD, // app password or SMTP password
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL || process.env.CONTACT_EMAIL,
      subject: `Contact Us - ${service}`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}