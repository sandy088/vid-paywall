import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import crypto from "crypto";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { razorpay } from "@/lib/razorpay";
import { db } from "@/src/db/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono()
  .get("/check-is-premium", verifyAuth(), async (c) => {
    const session = c.get("authUser");

    if (!session.token?.email) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, session.token?.email!));

    if (!user[0]) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ data: user[0].isPremium ?? false }, 200);
  })
  .post(
    "/verify-payment",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        raz_signature: z.string(),
        raz_payment_id: z.string(),
        raz_oid: z.string(),
      })
    ),
    async (c) => {
      const session = c.get("authUser");
      const { raz_signature, raz_payment_id, raz_oid } = c.req.valid("json");

      if (!session.token?.email) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!raz_signature || !raz_payment_id || !raz_oid) {
        return c.json({ error: "Invalid payment details" }, 400);
      }

      //verify payment
      const crypt = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      );
      crypt.update(raz_oid + "|" + raz_payment_id);

      const digest = crypt.digest("hex");

      const isVerified = digest === raz_signature;
      if (!isVerified) {
        return c.json({ error: "Payment verification failed" }, 400);
      }

      console.log("session user id", session.token?.email);

      await db
        .update(users)
        .set({ isPremium: true })
        .where(eq(users.email, session.token?.email!))
        .returning();

      return c.json({ data: isVerified }, 200);
    }
  )
  .post(
    "/create-order",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        planId: z.string(),
      })
    ),
    async (c) => {
      const session = c.get("authUser");
      const { planId } = c.req.valid("json");

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!planId) {
        return c.json({ error: "Invalid planId" }, 400);
      }

      //create Order

      let options = {
        amount: 999, //you can fetch it from DB as well
        currency: "INR",
        receipt: "rcp3",
      };

      const order = await razorpay.orders.create(options);

      if (!order) {
        return c.json({ error: "Order creation failed", order: order }, 500);
      }

      return c.json({ data: order }, 200);
    }
  );

export default app;
