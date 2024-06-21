import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import saltAndHashPassword from "./utils/salt_hash";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: {},
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;
        const pwHash = saltAndHashPassword(credentials.password as string);

        // user = await getUserFromDb(credentials.email, pwHash);
        const exampleUser = {
          email: "example@example.com",
          password: "12345",
          image: "https://avatars.githubusercontent.com/u/73393502?v=4",
          name: "Test User 0001",
        };

        if (
          credentials.email === exampleUser.email &&
          credentials.password === exampleUser.password
        ) {
          user = exampleUser;
        }

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.");
        }

        // return user object with the their profile data
        return user;
      },
    }),
  ],
});
