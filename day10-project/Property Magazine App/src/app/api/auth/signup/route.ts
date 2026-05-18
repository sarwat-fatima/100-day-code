import { dbConnect } from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = hashPassword(password);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name: email.split("@")[0], // Use part of email as default name
    });

    return Response.json(
      { message: "User created successfully", user: { email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
