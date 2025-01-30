import bcrypt from "bcrypt";

import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db/index";
import { users } from "$lib/server/db/schema";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 1 month

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();

    const role = data.get("user_role");
    const email = data.get("user_email");
    const password = data.get("user_password");

    console.log([role, email, password]);

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

    console.log("User:", user, user.length);

    if ((user[0].length === 0) || (password != user[0].password)) {
      return fail(400, {
        message: "Invalid credentials",
      });
    }

    cookies.set("logged_in", "true", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    cookies.set("user_email", user[0].email, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    // return {
    //   id: user.id,
    //   email: user.email,
    //   role: user.role,
    // };
    redirect(302, `/${user[0].role}`);
  },
};
