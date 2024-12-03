import bcrypt from "bcryptjs";

export default async function saltAndHashPassword(password: string) {
  const salt = await bcrypt.genSalt(10); // 10 is the cost factor
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword; // Store this hashed password in the database
}
