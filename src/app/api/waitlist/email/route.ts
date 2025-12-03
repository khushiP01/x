import { render } from "@react-email/render";

import WaitlistEmailTemplate from "@/app/emails/waitlist";

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

async function getRateLimiter() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  const { Redis } = await import("@upstash/redis");
  const { Ratelimit } = await import("@upstash/ratelimit");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return new Ratelimit({
    redis,
    // 2 requests per minute from the same IP address in a sliding window of 1 minute duration which means that the window slides forward every second and the rate limit is reset every minute for each IP address.
    limiter: Ratelimit.slidingWindow(2, "1 m"),
  });
}

export async function POST(request: NextRequest) {
  // Apply rate limiting if configured
  const ratelimit = await getRateLimiter();
  if (ratelimit) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "127.0.0.1";
    const result = await ratelimit.limit(ip);

    if (!result.success) {
      return Response.json(
        {
          error: "Too many requests!!",
        },
        {
          status: 429,
        },
      );
    }
  }

  const { email, firstname } = await request.json();

  // Get email configuration from environment variables
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Standout<hello@standout-app.com>";
  const replyToEmail = process.env.RESEND_REPLY_TO_EMAIL || "hello@standout-app.com";

  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: "Thank you for joining the Standout waitlist! 🎉",
    reply_to: replyToEmail,
    html: await render(WaitlistEmailTemplate({ userFirstname: firstname })),
  });

  if (error) {
    return NextResponse.json(error);
  }

  if (!data) {
    return NextResponse.json({ message: "Failed to send email" });
  }

  return NextResponse.json({ message: "Email sent successfully" });
}

