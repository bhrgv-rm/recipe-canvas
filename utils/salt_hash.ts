import bcrypt from "bcrypt";

export default async function saltAndHashPassword(
  password: string
): Promise<string> {
  // Generate a salt
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password with the generated salt
  const hashedPassword = await bcrypt.hash(password!, salt);

  return hashedPassword;
}
