import User from "@/models/User";
import connectDb from "@/utils/connectDb";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
const { ACTIVATION_TOKEN_SECRET } = process.env;
interface UserToken {
  id: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDb();
    const { token } = req.body;
    const userToken = jwt.verify(token, ACTIVATION_TOKEN_SECRET!) as UserToken;
    const userDb = await User.findById(userToken.id);
    if (!userDb) {
      return res.status(400).json({ message: "This account no longer exist." });
    }
    if (userDb.emailVerified == true) {
      return res
        .status(400)
        .json({ message: "Email address already verified." });
    }
    await User.findByIdAndUpdate(userDb.id, { emailVerified: true });
    res.json({
      message: "Your account has beeen successfully verified.",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
