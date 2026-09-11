import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is missing. Emails will not be sent.");
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3004", 10);

  app.use(express.json());

  // API Route for Lead Handling (Production Email Integration)
  app.post("/api/leads", async (req, res) => {
    const { firstName, lastName, email, phone, objective, brief } = req.body;
    const resend = getResend();
    const destination = process.env.CONTACT_EMAIL || "thebestprodigital@gmail.com";

    console.log("PRODUCTION LEAD RECEIVED:", { 
      firstName, 
      lastName, 
      email, 
      phone, 
      objective, 
      brief,
      timestamp: new Date().toISOString()
    });

    if (resend) {
      try {
        await resend.emails.send({
          from: "Best Pro Digital <leads@bestprodigital.com>", // Note: Resend requires a verified domain or uses their default
          to: [destination],
          subject: `MISSION BRIEF: ${firstName} ${lastName} - ${objective || "New Lead"}`,
          html: `
            <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border: 1px solid #c1ff72;">
              <h1 style="color: #c1ff72; text-transform: uppercase; letter-spacing: 2px;">New Strategic Brief</h1>
              <p style="font-size: 16px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p style="font-size: 16px;"><strong>Email:</strong> ${email}</p>
              <p style="font-size: 16px;"><strong>Phone:</strong> ${phone}</p>
              <p style="font-size: 16px;"><strong>Objective:</strong> ${objective || "N/A"}</p>
              <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
              <p style="font-size: 18px; color: #888;">BRIEF:</p>
              <p style="font-size: 16px; line-height: 1.6;">${brief}</p>
            </div>
          `
        });
        console.log("Email transmitted to:", destination);
      } catch (error) {
        console.error("Resend delivery failed:", error);
      }
    }

    res.status(201).json({ 
      success: true, 
      message: "Lead synchronized and transmitted." 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Best Pro Digital Agency Infrastructure running on http://localhost:${PORT}`);
  });
}

startServer();
