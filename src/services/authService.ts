import bcrypt from "bcrypt";
import crypto from "crypto";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

type AuthResponse = {
  status: number;
  message: string;
  token: string | null;
};

export async function authenticateUser(email: string, pin: string): Promise<AuthResponse> {
  const userRepository = AppDataSource.getRepository(User);

  let user = await userRepository.findOne({ where: { email } });
  if (!user) {
    return {
      status: 401,
      message: "Invalid email or PIN",
      token: null,
    };
  }

  const isValidPin = await bcrypt.compare(pin, user.pinHash);

  if (!isValidPin) {
    return { status: 401, message: "Invalid email or PIN", token: null };
  } else {
    const token = generateAuthToken();
    user.authToken = token;
    await userRepository.save(user);
    return { token, status: 200, message: "Authentication successful" };
  }
}

function generateAuthToken() {
  return crypto.randomUUID();
}
