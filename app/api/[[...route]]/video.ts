import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { signStreamUrl } from "@/lib/sign-stream-url";

const app = new Hono().get(
  "/get-signed-url",
  verifyAuth(),
  zValidator("query", z.object({ iFrameUrl: z.string() })),
  async (c) => {
    const session = c.get("authUser");
    const { iFrameUrl } = c.req.valid("query");

    if (!session.token?.email) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // get signed url
    const hash = signStreamUrl(iFrameUrl, process.env.BUNNY_SECURITY_KEY!);

    return c.json({ data: hash }, 200);
  }
);

export default app;
