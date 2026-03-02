import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { booking } = await req.json();
    if (!booking) {
      throw new Error("Missing booking data");
    }

    const {
      full_name,
      email,
      contact_number,
      number_of_pax,
      date_of_visit,
      time_of_arrival,
      table_type,
      special_requests,
    } = booking;

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
        <div style="background: #1a0000; padding: 24px 32px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 20px; margin: 0; letter-spacing: 3px; text-transform: uppercase;">New Reservation</h1>
          <p style="color: #cc0000; font-size: 11px; letter-spacing: 2px; margin: 8px 0 0; text-transform: uppercase;">Auxiliary Bar &amp; Lounge</p>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #999; width: 140px;">Guest Name</td>
              <td style="padding: 12px 0; color: #333; font-weight: 600;">${full_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #999;">Email</td>
              <td style="padding: 12px 0; color: #333;">${email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #999;">Contact</td>
              <td style="padding: 12px 0; color: #333;">${contact_number}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #999;">Guests</td>
              <td style="padding: 12px 0; color: #333;">${number_of_pax} pax</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #999;">Date</td>
              <td style="padding: 12px 0; color: #333; font-weight: 600;">${date_of_visit}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #999;">Arrival</td>
              <td style="padding: 12px 0; color: #333;">${time_of_arrival}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #999;">Table</td>
              <td style="padding: 12px 0; color: #333;">${table_type}</td>
            </tr>
            ${special_requests ? `
            <tr>
              <td style="padding: 12px 0; color: #999;">Requests</td>
              <td style="padding: 12px 0; color: #333;">${special_requests}</td>
            </tr>` : ""}
          </table>
        </div>
        <div style="background: #fafafa; padding: 16px 32px; text-align: center; border-top: 1px solid #f0f0f0;">
          <p style="color: #999; font-size: 11px; margin: 0;">Check your admin dashboard to confirm or manage this reservation.</p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Auxiliary Bar <onboarding@resend.dev>",
        to: ["johncarltorio@gmail.com"],
        subject: `New Reservation: ${full_name} — ${date_of_visit}`,
        html: htmlContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      throw new Error(`Resend API error [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
