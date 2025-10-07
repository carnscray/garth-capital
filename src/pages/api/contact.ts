import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const TO = import.meta.env.CONTACT_TO ?? "hello@knowbrainertrivia.com.au";
const FROM = import.meta.env.CONTACT_FROM ?? "no-reply@knowbrainertrivia.com.au";

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const form = await request.formData();

  // Honeypot (no JS needed)
  const website = (form.get("website") || "").toString().trim();
  if (website) return redirectToThanks();

  // Read fields
  const fullName = (form.get("fullName") || "").toString().trim();
  const email    = (form.get("email")    || "").toString().trim();
  const mobile   = (form.get("mobile")   || "").toString().trim();
  const reason   = (form.get("reason")   || "").toString().trim();
  const message  = (form.get("message")  || "").toString().trim();

  // Minimal server-side checks (browser does HTML5 validation first)
  if (!fullName || !email || !reason || !message) return badRequest();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return badRequest();

  const subject = `Contact Form: ${reason} — ${fullName}`;
  const lines = [
    `From: ${fullName}`,
    `Email: ${email}`,
    mobile ? `Mobile: ${mobile}` : null,
    `Reason: ${reason}`,
    `IP: ${clientAddress ?? "unknown"}`,
    "",
    message,
  ].filter(Boolean);

  try {
    await resend.emails.send({
      from: FROM,
      to: [TO],
      subject,
      text: lines.join("\n"),
      // If you want replies to go to the sender, add:
      // reply_to: email,
    });

    return redirectToThanks();
  } catch (err) {
    // console.error(err);
    return new Response("Email failed", { status: 500 });
  }
};

function redirectToThanks() {
  // 303 makes the browser follow up with a GET (safe to reload/share)
  return new Response(null, { status: 303, headers: { Location: "/thankyou" } });
}
function badRequest() {
  return new Response("Invalid submission", { status: 400 });
}
