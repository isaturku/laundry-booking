import { OAuthRequestError } from "@lucia-auth/oauth";
import type { APIRoute } from "astro";
import { auth, googleAuth } from "../../../lib/lucia.js";


export const get: APIRoute = async (context) => {
  const storedState = context.cookies.get("google_oauth_state")!.value;
  const state = context.url.searchParams.get("state");
  const code = context.url.searchParams.get("code");
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400
    });
  }
  try {
    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);
    let isFirstTimeUser = false;
    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          username: googleUser.name,
          room_nr: null,
          admin: 0
        }
      });
      isFirstTimeUser = true;
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    });
    context.locals.auth.setSession(session);
    if (isFirstTimeUser) return context.redirect("/login/complete", 302)
    return context.redirect("/", 302);
  } catch (e) {
    console.log(e)
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
};
