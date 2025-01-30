import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
  cookies.delete("session", { path: "/" });

  redirect(302, "/login");
}
