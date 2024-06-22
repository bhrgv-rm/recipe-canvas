import authConfig from "./auth.config";
import NextAuth from "next-auth";
const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const isLogged = !!req.auth;
  console.log("Route -> :", req.nextUrl.pathname);
  console.log("isLogged: ", isLogged);
  console.log(req.auth?.user);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_favicon.ico).*)"],
};
