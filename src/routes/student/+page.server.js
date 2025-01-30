import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
  // if (!user) throw redirect(302, "/login");

  console.log(cookies.get("logged_in"), cookies.get("user_email"));

  return {
    loggin_in: cookies.get("logged_in"),
    logged_email: cookies.get("user_email"),
  };
}
