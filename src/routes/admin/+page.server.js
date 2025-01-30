import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
  // cookies.delete("logged_in", { path: "/" });

  if (cookies.get("logged_in") && cookies.get("user_email")) {
    return {
      logged_in: cookies.get("logged_in"),
      logged_email: cookies.get("user_email"),
    };
  } else throw redirect(302, "/login");
}
