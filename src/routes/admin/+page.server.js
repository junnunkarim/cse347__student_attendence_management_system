import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
  // cookies.delete("logged_in", { path: "/" });
  // cookies.delete("user_email", { path: "/" });
  // cookies.delete("session", { path: "/" });

  const session_cookie_json = cookies.get("session");

  if (session_cookie_json) {
    const session_cookie = JSON.parse(session_cookie_json);

    // console.log("TEST:", JSON.parse(session_cookie_json));

    if (session_cookie.role !== "admin") {
      throw redirect(302, `/${session_cookie.role}`);
    }

    return {
      logged_in: session_cookie.logged_in,
      logged_role: session_cookie.role,
      logged_email: session_cookie.email,
    };
  } else {
    throw redirect(302, "/login");
  }
}
