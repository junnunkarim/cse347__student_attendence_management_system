// import { fail, redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
  let nav_info = {
    show_nav: true,
    role: "",
    render_items: [],
  };

  // if already logged-in go to the page of the logged-in role
  const session_cookie_json = cookies.get("session");
  if (session_cookie_json) {
    const session_cookie = JSON.parse(session_cookie_json);

    if (session_cookie.role === "student") {
      nav_info.role = "student";
      nav_info.render_items.push({ name: "logout", link: "/logout" });
    } else if (session_cookie.role === "faculty") {
      nav_info.role = "faculty";
      nav_info.render_items.push({ name: "logout", link: "/logout" });
    } else if (session_cookie.role === "admin") {
      nav_info.role = "admin";
      nav_info.render_items.push({ name: "test1", link: "/test1" });
      nav_info.render_items.push({ name: "test1", link: "/test1" });
      nav_info.render_items.push({ name: "logout", link: "/logout" });
    }
  } else {
    nav_info.show_nav = false;
  }

  return {
    nav_info,
  };
}
