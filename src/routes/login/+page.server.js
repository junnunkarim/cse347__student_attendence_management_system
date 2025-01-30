import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db/index";
import { users } from "$lib/server/db/schema";

export async function load({ cookies }) {
  // if already logged-in go to the page of the logged-in role
  const session_cookie_json = cookies.get("session");
  if (session_cookie_json) {
    const session_cookie = JSON.parse(session_cookie_json);

    redirect(302, `/${session_cookie.role}`);
  }
}

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();

    const role = data.get("user_role");
    const email = data.get("user_email");
    const password = data.get("user_password");

    // console.log([role, email, password]);

    const user = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .execute();

    // console.log("User:", user, user.length);

    if ((user[0].length === 0) || (password != user[0].password)) {
      return fail(400, {
        message: "Invalid credentials",
      });
    }

    const session_info = JSON.stringify({
      logged_in: true,
      role: user[0].role,
      email: user[0].email,
    });

    cookies.set("session", session_info, {
      path: "/",
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    redirect(302, `/${user[0].role}`);
  },
};
