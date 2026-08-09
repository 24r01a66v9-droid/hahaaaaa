import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import nodemailer from "nodemailer";
import { createDevelopmentAdminAccount, shouldUseDevelopmentFallback } from "./src/auth/fallback";
import { hashPassword, verifyPassword } from "./src/auth/password";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads in memory (prevents disk usage on cloud platforms)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg", "image/x-png", "image/svg+xml"];
    const normalizedMime = (file.mimetype || "").toLowerCase();
    if (allowedMimes.includes(normalizedMime) || normalizedMime.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
    }
  },
});

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_for_dev";

const createMailTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user,
      pass,
    },
  });
};

const sendPasswordResetEmail = async (toEmail: string, resetUrl: string) => {
  const transporter = createMailTransporter();

  if (!transporter) {
    console.log(`[dev] SMTP not configured. Password reset link for ${toEmail}: ${resetUrl}`);
    return { sent: false, resetUrl, reason: "SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) are not set in .env" };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@ikshana.local",
      to: toEmail,
      subject: "Reset your Ikshana password",
      html: `<p>Hello,</p><p>Use the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });
    return { sent: true, resetUrl };
  } catch (err: any) {
    console.error("Failed to send email via SMTP:", err);
    return { sent: false, resetUrl, reason: err?.message || "Failed to send email via SMTP server" };
  }
};

function normalizeEventRecord(event: any) {
  if (!event) return event;
  return {
    ...event,
    activities: typeof event.activities === "string" ? JSON.parse(event.activities) : (event.activities || []),
  };
}

function normalizeLeadershipMemberRecord(member: any) {
  if (!member) return member;
  return {
    id: member.id,
    name: member.name || "",
    role: member.role || "",
    image: member.image || "",
    category: member.category ?? member.cateogry ?? "currentBoard",
    displayOrder: typeof member.display_order === "number" ? member.display_order : (member.displayOrder ?? 1),
  };
}

async function insertLeadershipMemberRecord(payload: Record<string, any>) {
  try {
    const { data, error } = await supabase.from("leadership_members").insert([payload]).select();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.includes("column") && (message.includes("category") || message.includes("cateogry"))) {
      const fallbackPayload = { ...payload };
      if (fallbackPayload.category !== undefined) {
        fallbackPayload.cateogry = fallbackPayload.category;
        delete fallbackPayload.category;
      }
      const { data, error: fallbackError } = await supabase.from("leadership_members").insert([fallbackPayload]).select();
      if (fallbackError) throw fallbackError;
      return { data, error: null };
    }
    throw error;
  }
}

async function updateLeadershipMemberRecord(id: string, payload: Record<string, any>) {
  try {
    const { data, error } = await supabase.from("leadership_members").update(payload).eq("id", id).select();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.includes("column") && (message.includes("category") || message.includes("cateogry"))) {
      const fallbackPayload = { ...payload };
      if (fallbackPayload.category !== undefined) {
        fallbackPayload.cateogry = fallbackPayload.category;
        delete fallbackPayload.category;
      }
      const { data, error: fallbackError } = await supabase.from("leadership_members").update(fallbackPayload).eq("id", id).select();
      if (fallbackError) throw fallbackError;
      return { data, error: null };
    }
    throw error;
  }
}

function isLeadershipTableMissingError(error: any) {
  return Boolean(
    error?.code === "42P01" ||
    error?.message?.includes("leadership_members") ||
    error?.message?.includes("relation") ||
    error?.message?.includes("does not exist")
  );
}

function isAdminRequest(req: any) {
  const email = String(req.user?.email || "").trim().toLowerCase();
  return req.user?.role === "admin" || email === "24r01a66v9@cmrithyderabad.edu.in" || email === "admin@ikshana.local" || process.env.NODE_ENV !== "production";
}

// Supabase Setup (Mandatory)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("FATAL CONFIG ERROR: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be defined.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Connected to Supabase. SQLite integration has been removed.");

// Helper: Upload file buffer to Supabase Storage with a local fallback
async function uploadToSupabaseStorage(file: any, bucketName: string = "photos"): Promise<string> {
  const fileExt = path.extname(file.originalname);
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = `img-${uniqueSuffix}${fileExt}`;

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error: any) {
    console.error("Supabase Storage Upload Error, using local fallback:", error);

    const uploadsDir = path.join(__dirname, "uploads");
    await fs.promises.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, fileName);
    await fs.promises.writeFile(filePath, file.buffer);

    return `/uploads/${fileName}`;
  }
}

// Helper: Delete file from Supabase Storage by its public URL
async function deleteFromSupabaseStorage(url: string, bucketName: string = "photos"): Promise<void> {
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);
    
    if (error) {
      console.error("Supabase Storage Delete Error:", error);
    }
  } catch (e) {
    console.error("Failed to parse/delete file from Supabase Storage:", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const host = "0.0.0.0";

  const listenWithFallback = async (port: number): Promise<number> => {
    return await new Promise<number>((resolve, reject) => {
      const server = app.listen(port, host, () => resolve(port));
      server.on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE" && port < 3010) {
          console.warn(`Port ${port} is busy, trying ${port + 1}...`);
          server.close(() => {
            listenWithFallback(port + 1).then(resolve).catch(reject);
          });
        } else {
          reject(error);
        }
      });
    });
  };

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  const developmentAdminAccount = shouldUseDevelopmentFallback({ NODE_ENV: process.env.NODE_ENV })
    ? await createDevelopmentAdminAccount({
        NODE_ENV: process.env.NODE_ENV,
        DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL,
        DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
      })
    : null;

  // Serve uploaded files as static assets (fallback for local files)
  const uploadsDir = path.join(__dirname, "uploads");
  app.use("/uploads", express.static(uploadsDir));

  // Health check for deployment platforms
  app.get("/health", (req, res) => res.status(200).send("ok"));

  app.get('/favicon.ico', (req, res) => {
    res.type('image/x-icon').send('');
  });

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const cookieToken = req.cookies?.token || "";
    const authHeader = req.headers.authorization || "";
    const fallbackHeaderToken = req.headers["x-ikshana-token"] || "";
    const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    const token = cookieToken || headerToken || fallbackHeaderToken;

    if (!token) {
      const developmentAdmin = developmentAdminAccount;
      if (developmentAdmin) {
        req.user = {
          id: 0,
          name: developmentAdmin.name,
          email: developmentAdmin.emails[0],
          role: developmentAdmin.role,
        };
        return next();
      }
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        const developmentAdmin = developmentAdminAccount;
        if (developmentAdmin) {
          req.user = {
            id: 0,
            name: developmentAdmin.name,
            email: developmentAdmin.emails[0],
            role: developmentAdmin.role,
          };
          return next();
        }
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = user;
      next();
    });
  };

  const authenticateOptionalToken = (req: any, res: any, next: any) => {
    const cookieToken = req.cookies.token;
    const authHeader = req.headers.authorization || "";
    const fallbackHeaderToken = req.headers["x-ikshana-token"] || "";
    const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    const token = cookieToken || headerToken || fallbackHeaderToken;

    if (!token) {
      req.user = null;
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        req.user = null;
        return next();
      }
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    try {
      const hashedPassword = await hashPassword(password);
      const role = cleanEmail === "24r01a66v9@cmrithyderabad.edu.in" ? "admin" : "user";
      
      const { data, error } = await supabase
        .from("users")
        .insert([{ name: String(name).trim(), email: cleanEmail, password: hashedPassword, role }])
        .select();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: "Email already exists" });
        }
        throw error;
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Registration failed:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .ilike("email", email)
        .maybeSingle();

      if (error) throw error;

      if (developmentAdminAccount) {
        const normalizedFallbackEmails = developmentAdminAccount.emails.map((candidate) => candidate.toLowerCase());
        if (normalizedFallbackEmails.includes(email)) {
          const validPassword = password === developmentAdminAccount.password || (await bcrypt.compare(password, developmentAdminAccount.passwordHash));
          if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
          }

          const fallbackEmail = developmentAdminAccount.emails.find((candidate) => candidate.toLowerCase() === email) || developmentAdminAccount.emails[0];
          const token = jwt.sign(
            { id: user?.id || 0, name: user?.name || developmentAdminAccount.name, email: fallbackEmail, role: developmentAdminAccount.role },
            JWT_SECRET,
            { expiresIn: "24h" }
          );
          res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
          return res.json({
            user: { id: user?.id || 0, name: user?.name || developmentAdminAccount.name, email: fallbackEmail, role: developmentAdminAccount.role },
            token,
          });
        }
      }

      if (!user || !(await verifyPassword(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Force admin role for the specific email
      const role = user.email.toLowerCase() === "24r01a66v9@cmrithyderabad.edu.in" ? "admin" : user.role;

      const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: role }, JWT_SECRET, { expiresIn: "24h" });
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
      res.json({ user: { id: user.id, name: user.name, email: user.email, role: role }, token });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      let userId: number | null = null;
      let targetEmail = email;

      const { data: user, error } = await supabase.from("users").select("id, email").ilike("email", email).maybeSingle();
      if (error) throw error;

      if (user) {
        userId = user.id;
        targetEmail = user.email;
      } else if (developmentAdminAccount) {
        const normalizedFallback = developmentAdminAccount.emails.map((e) => e.toLowerCase());
        if (normalizedFallback.includes(email)) {
          userId = 0;
          targetEmail = email;
        }
      }

      if (userId === null) {
        return res.json({ success: true, message: "If an account exists for that email, a reset link has been sent." });
      }

      const resetToken = jwt.sign({ id: userId, email: targetEmail, purpose: "password-reset" }, JWT_SECRET, { expiresIn: "1h" });
      
      const reqOrigin = req.get("origin") || (req.get("referer") ? new URL(req.get("referer")!).origin : null);
      const host = req.get("host") || "localhost:3000";
      const protocol = req.protocol || "http";
      const baseUrl = process.env.FRONTEND_URL || process.env.APP_URL || reqOrigin || `${protocol}://${host}`;

      const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
      const mailResult = await sendPasswordResetEmail(targetEmail, resetUrl);

      const message = mailResult.sent
        ? "A password reset link has been sent to your email address."
        : "SMTP email server is not configured in .env, so no email could be dispatched. Use the reset link below to proceed:";

      return res.json({
        success: true,
        message,
        resetUrl: mailResult.resetUrl,
      });
    } catch (error) {
      console.error("Forgot password failed:", error);
      return res.status(500).json({ error: "Unable to process password reset" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    const { token, newPassword } = req.body || {};

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Reset token and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id?: number; email?: string; purpose?: string };
      if (decoded?.purpose !== "password-reset" || !decoded?.email) {
        return res.status(400).json({ error: "Invalid reset token" });
      }

      const hashedPassword = await hashPassword(String(newPassword));

      // Try finding user in Supabase
      const { data: user, error } = await supabase.from("users").select("id, email").ilike("email", decoded.email).maybeSingle();
      if (error) throw error;

      if (user) {
        const { error: updateError } = await supabase.from("users").update({ password: hashedPassword }).eq("id", user.id);
        if (updateError) throw updateError;
      } else if (developmentAdminAccount && developmentAdminAccount.emails.map(e => e.toLowerCase()).includes(decoded.email.toLowerCase())) {
        developmentAdminAccount.password = String(newPassword);
        developmentAdminAccount.passwordHash = hashedPassword;

        // Upsert into Supabase users table so future lookups work
        await supabase.from("users").upsert([
          { name: developmentAdminAccount.name, email: decoded.email.toLowerCase(), password: hashedPassword, role: developmentAdminAccount.role }
        ], { onConflict: "email" });
      } else {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ success: true, message: "Password reset successful" });
    } catch (error: any) {
      if (error?.name === "TokenExpiredError" || error?.name === "JsonWebTokenError") {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      console.error("Reset password failed:", error);
      return res.status(500).json({ error: "Unable to reset password" });
    }
  });

  app.post("/api/auth/change-password", authenticateToken, async (req: any, res) => {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    try {
      const normalizedEmail = String(req.user?.email || "").trim().toLowerCase();
      const isDevelopmentAdmin = developmentAdminAccount && normalizedEmail && developmentAdminAccount.emails.map((candidate) => candidate.toLowerCase()).includes(normalizedEmail);

      if (isDevelopmentAdmin) {
        const current = String(currentPassword || "");
        const expected = String(developmentAdminAccount.password || "");
        if (current !== expected) {
          return res.status(401).json({ error: "Current password is incorrect" });
        }
        return res.json({ success: true, message: "Password updated for development admin account" });
      }

      const { data: user, error } = await supabase.from("users").select("*" ).eq("email", req.user.email).maybeSingle();
      if (error) throw error;

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.password || !(await verifyPassword(currentPassword, user.password))) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const hashedPassword = await hashPassword(newPassword);
      const { error: updateError } = await supabase.from("users").update({ password: hashedPassword }).eq("id", user.id);
      if (updateError) throw updateError;

      return res.json({ success: true });
    } catch (error) {
      console.error("Change password failed:", error);
      return res.status(500).json({ error: "Unable to change password" });
    }
  });

  app.get("/api/auth/me", authenticateOptionalToken, (req: any, res) => {
    if (!req.user) {
      return res.status(204).send();
    }
    res.json({ user: req.user });
  });

  // Events API
  app.get("/api/events", async (req, res) => {
    try {
      const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.json((data || []).map(normalizeEventRecord));
    } catch (error: any) {
      console.error("Supabase fetch events error:", error);
      if (error?.message?.includes("acknowledgments") || error?.message?.includes("column") || error?.message?.includes("schema cache")) {
        return res.json([]);
      }
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { title, date, occasion, description, acknowledgments, activities, image } = req.body;
    if (!title || !date || !description) {
      return res.status(400).json({ error: "Title, date, and description are required" });
    }

    try {
      const insertPayload: Record<string, any> = {
        title,
        date,
        occasion: occasion || "Additional Event",
        description,
      };

      if (acknowledgments !== undefined) insertPayload.acknowledgments = acknowledgments || null;
      if (activities !== undefined) insertPayload.activities = Array.isArray(activities) ? activities : [];
      if (image !== undefined) insertPayload.image = image || null;

      const { data, error } = await supabase.from("events").insert([insertPayload]).select();

      if (error) throw error;
      return res.json({ success: true, event: normalizeEventRecord(data?.[0]) });
    } catch (error: any) {
      console.error("Supabase add event error:", error);
      if (error?.message?.includes("acknowledgments") || error?.message?.includes("column") || error?.message?.includes("schema cache")) {
        return res.status(500).json({ error: "Your Supabase events table is missing one or more required columns. Please create the table first." });
      }
      res.status(500).json({ error: error.message || "Failed to add event" });
    }
  });

  app.patch("/api/events/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { id } = req.params;
    const { title, date, occasion, description, acknowledgments, activities, image } = req.body;

    try {
      const { data, error } = await supabase.from("events").update({
        title,
        date,
        occasion,
        description,
        acknowledgments,
        activities: Array.isArray(activities) ? activities : [],
        image,
      }).eq("id", id).select();

      if (error) throw error;
      return res.json({ success: true, event: normalizeEventRecord(data?.[0]) });
    } catch (error: any) {
      console.error("Supabase update event error:", error);
      res.status(500).json({ error: error.message || "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { id } = req.params;
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error: any) {
      console.error("Supabase delete event error:", error);
      res.status(500).json({ error: error.message || "Failed to delete event" });
    }
  });

  // Leadership members API
  app.get("/api/leadership-members", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("leadership_members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      return res.json((data || []).map(normalizeLeadershipMemberRecord));
    } catch (error: any) {
      console.error("Supabase fetch leadership members error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch leadership members" });
    }
  });

  app.post("/api/leadership-members", authenticateToken, upload.single("file"), async (req: any, res) => {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { name, role, category, displayOrder } = req.body || {};
    if (!name || !role || !category) {
      return res.status(400).json({ error: "Name, role, and category are required" });
    }

    try {
      let imageUrl = req.body?.image || "";
      if (req.file) {
        imageUrl = await uploadToSupabaseStorage(req.file, "photos");
      }

      const nextDisplayOrder = typeof displayOrder === "number"
        ? displayOrder
        : (typeof displayOrder === "string" && displayOrder !== "" ? Number(displayOrder) : 1);

      const payload = {
        name: String(name).trim(),
        role: String(role).trim(),
        category: String(category),
        image: imageUrl || null,
        display_order: nextDisplayOrder,
      };

      try {
        const { data, error } = await insertLeadershipMemberRecord(payload);
        if (error) throw error;
        return res.json({ success: true, member: normalizeLeadershipMemberRecord(data?.[0]) });
      } catch (error: any) {
        throw error;
      }
    } catch (error: any) {
      console.error("Supabase add leadership member error:", error);
      res.status(500).json({ error: error.message || "Failed to add leadership member" });
    }
  });

  app.patch("/api/leadership-members/:id", authenticateToken, upload.single("file"), async (req: any, res) => {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { id } = req.params;
    const { name, role, category, displayOrder } = req.body || {};

    try {
      const updatePayload: Record<string, any> = {};
      if (name !== undefined) updatePayload.name = String(name).trim();
      if (role !== undefined) updatePayload.role = String(role).trim();
      if (category !== undefined) updatePayload.category = String(category);
      if (displayOrder !== undefined) updatePayload.display_order = Number(displayOrder);

      if (req.file) {
        updatePayload.image = await uploadToSupabaseStorage(req.file, "photos");
      } else if (req.body?.image !== undefined) {
        updatePayload.image = req.body.image || null;
      }

      try {
        const { data, error } = await updateLeadershipMemberRecord(id, updatePayload);
        if (error) throw error;
        return res.json({ success: true, member: normalizeLeadershipMemberRecord(data?.[0]) });
      } catch (error: any) {
        throw error;
      }
    } catch (error: any) {
      console.error("Supabase update leadership member error:", error);
      res.status(500).json({ error: error.message || "Failed to update leadership member" });
    }
  });

  app.delete("/api/leadership-members/:id", authenticateToken, async (req: any, res) => {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { id } = req.params;
    try {
      try {
        const { data: memberData, error: fetchError } = await supabase
          .from("leadership_members")
          .select("image")
          .eq("id", id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (memberData?.image) {
          await deleteFromSupabaseStorage(memberData.image, "photos");
        }

        const { error } = await supabase.from("leadership_members").delete().eq("id", id);
        if (error) throw error;
        return res.json({ success: true });
      } catch (error: any) {
        throw error;
      }
    } catch (error: any) {
      console.error("Supabase delete leadership member error:", error);
      res.status(500).json({ error: error.message || "Failed to delete leadership member" });
    }
  });

  // Photos API
  app.get("/api/photos", async (req, res) => {
    const { category, sub_category } = req.query;
    try {
      let query = supabase.from("photos").select("*");
      if (category) query = query.eq("category", category);
      if (sub_category) query = query.eq("sub_category", sub_category);
      
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data);
    } catch (error) {
      console.error("Supabase fetch photos error:", error);
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  app.post("/api/photos", authenticateOptionalToken, upload.single("file"), async (req: any, res) => {
    const email = String(req.user?.email || "").trim().toLowerCase();
    const isAuthorized = req.user?.role === "admin" || email === "24r01a66v9@cmrithyderabad.edu.in" || email === "admin@ikshana.local" || process.env.NODE_ENV !== "production";

    if (!isAuthorized) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { title, category, sub_category, date, is_featured } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    try {
      // Upload file to Supabase storage bucket named 'photos'
      const fileUrl = await uploadToSupabaseStorage(req.file, "photos");

      // Normalize is_featured coming from form-data (handles "true"/"false", "1"/"0", booleans)
      const featuredFlag = (is_featured === "true" || is_featured === "1" || is_featured === 1 || is_featured === true) ? 1 : 0;

      // Insert metadata to 'photos' table
      const { data, error } = await supabase.from("photos").insert([{
        url: fileUrl,
        title: title || null,
        category,
        sub_category: sub_category || null,
        date: date || new Date().toLocaleDateString(),
        is_featured: featuredFlag
      }]).select();
      
      if (error) throw error;
      res.json({ success: true, id: data[0].id, url: fileUrl });
    } catch (error: any) {
      console.error("Supabase add photo error:", error);
      res.status(500).json({ error: error.message || "Failed to add photo" });
    }
  });

  app.delete("/api/photos/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    
    try {
      // Fetch photo to get the URL
      const { data: photoData, error: fetchError } = await supabase
        .from("photos")
        .select("url")
        .eq("id", id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete file from storage
      if (photoData && photoData.url) {
        await deleteFromSupabaseStorage(photoData.url, "photos");
      }
      
      // Delete photo from database
      const { error } = await supabase.from("photos").delete().eq("id", id);
      if (error) throw error;
      
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete photo error:", error);
      res.status(500).json({ error: "Failed to delete photo from storage or database" });
    }
  });

  app.patch("/api/photos/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    const { title, category, sub_category, date } = req.body || {};

    try {
      const updatePayload: Record<string, any> = {};
      if (title !== undefined) updatePayload.title = title;
      if (category !== undefined) updatePayload.category = category;
      if (sub_category !== undefined) updatePayload.sub_category = sub_category;
      if (date !== undefined) updatePayload.date = date;

      const { data, error } = await supabase.from("photos").update(updatePayload).eq("id", id).select();
      if (error) throw error;
      return res.json({ success: true, photo: data?.[0] });
    } catch (error: any) {
      console.error("Supabase update photo error:", error);
      return res.status(500).json({ error: error.message || "Failed to update photo" });
    }
  });

  app.patch("/api/photos/:id/feature", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    const { category } = req.body;

    try {
      // Reset all featured in this category
      const { error: resetError } = await supabase
        .from("photos")
        .update({ is_featured: 0 })
        .eq("category", category);
      if (resetError) throw resetError;

      // Set the selected photo to featured
      const { data, error } = await supabase
        .from("photos")
        .update({ is_featured: 1 })
        .eq("id", id)
        .select();
      if (error) throw error;

      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase feature photo error:", error);
      return res.status(500).json({ error: "Failed to feature photo" });
    }
  });

  // Videos API
  app.get("/api/videos", async (req, res) => {
    try {
      const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data);
    } catch (error) {
      console.error("Supabase fetch videos error:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.post("/api/videos", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { title, description, url, thumbnail, category, date } = req.body;
    if (!title || !url) return res.status(400).json({ error: "Title and URL are required" });

    try {
      const { data, error } = await supabase.from("videos").insert([{
        title,
        description: description || null,
        url,
        thumbnail: thumbnail || null,
        category: category || "General",
        date: date || new Date().toLocaleDateString()
      }]).select();
      
      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add video error:", error);
      res.status(500).json({ error: "Failed to add video" });
    }
  });

  app.delete("/api/videos/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete video error:", error);
      res.status(500).json({ error: "Failed to delete video" });
    }
  });

  // Sponsors API
  app.get("/api/sponsors", async (req, res) => {
    try {
      const { data, error } = await supabase.from("sponsors").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    } catch (error) {
      console.error("Supabase fetch sponsors error:", error);
      res.status(500).json({ error: "Failed to fetch sponsors" });
    }
  });

  app.post("/api/sponsors", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { name, description, logo_url, website_url, type, contact_email, contact_phone } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    try {
      const { data, error } = await supabase.from("sponsors").insert([{
        name,
        description: description || null,
        logo_url: logo_url || null,
        website_url: website_url || null,
        type: type || "sponsor",
        contact_email: contact_email || null,
        contact_phone: contact_phone || null,
      }]).select();

      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add sponsor error:", error);
      res.status(500).json({ error: "Failed to add sponsor" });
    }
  });

  app.delete("/api/sponsors/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    try {
      const { error } = await supabase.from("sponsors").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete sponsor error:", error);
      res.status(500).json({ error: "Failed to delete sponsor" });
    }
  });

  // Job Openings API
  app.get("/api/jobs", async (req, res) => {
    try {
      const { data, error } = await supabase.from("job_openings").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    } catch (error) {
      console.error("Supabase fetch jobs error:", error);
      res.status(500).json({ error: "Failed to fetch job openings" });
    }
  });

  app.post("/api/jobs", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { title, department, description, requirements, location, job_type, contact_email } = req.body;
    if (!title || !description) return res.status(400).json({ error: "Title and description are required" });

    try {
      const { data, error } = await supabase.from("job_openings").insert([{
        title,
        department: department || null,
        description,
        requirements: requirements || null,
        location: location || null,
        job_type: job_type || "volunteer",
        contact_email: contact_email || null,
        is_active: true,
      }]).select();

      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add job error:", error);
      res.status(500).json({ error: "Failed to add job opening" });
    }
  });

  app.delete("/api/jobs/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    try {
      const { error } = await supabase.from("job_openings").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete job error:", error);
      res.status(500).json({ error: "Failed to delete job opening" });
    }
  });

  // Reviews API
  app.get("/api/reviews", async (req, res) => {
    try {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data);
    } catch (error) {
      console.error("Supabase fetch reviews error:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    const { user_name, rating, comment } = req.body;
    if (!user_name || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const { data, error } = await supabase.from("reviews").insert([{
        user_name,
        rating,
        comment
      }]).select();
      
      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add review error:", error);
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  // Medical Requests API
  app.post("/api/medical-request", async (req, res) => {
    const { patient_name, contact_number, emergency_details, hospital_name, required_amount, documents } = req.body;
    if (!patient_name || !contact_number || !emergency_details) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const { data, error } = await supabase.from("medical_requests").insert([{
        patient_name,
        contact_number,
        emergency_details,
        hospital_name,
        required_amount,
        documents,
        status: 'pending'
      }]).select();
      
      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add medical request error:", error);
      res.status(500).json({ error: "Failed to submit request" });
    }
  });

  app.get("/api/medical-request/:contact", async (req, res) => {
    const { contact } = req.params;

    try {
      const { data, error } = await supabase
        .from("medical_requests")
        .select("*")
        .eq("contact_number", contact)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (error) throw error;
      if (data && data.length > 0) {
        return res.json(data[0]);
      } else {
        return res.status(404).json({ error: "No request found for this number" });
      }
    } catch (error) {
      console.error("Supabase fetch medical request error:", error);
      res.status(500).json({ error: "Failed to fetch request status" });
    }
  });

  app.get("/api/medical-requests", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("medical_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return res.json(data);
    } catch (error) {
      console.error("Supabase fetch all medical requests error:", error);
      res.status(500).json({ error: "Failed to fetch medical requests" });
    }
  });

  app.delete("/api/medical-request/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;

    try {
      const { error } = await supabase.from("medical_requests").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete medical request error:", error);
      res.status(500).json({ error: "Failed to delete request" });
    }
  });

  app.patch("/api/medical-request/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    const { status, expiry_date } = req.body;

    try {
      const updateFields: any = {};
      if (status !== undefined) updateFields.status = status;
      if (expiry_date !== undefined) updateFields.expiry_date = expiry_date;

      const { data, error } = await supabase
        .from("medical_requests")
        .update(updateFields)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return res.json({ success: true, data: data[0] });
    } catch (error) {
      console.error("Supabase update medical request error:", error);
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  // RSVP API
  app.post("/api/rsvp", async (req, res) => {
    const { event_id, name, email } = req.body;
    if (!event_id || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    try {
      const { data, error } = await supabase.from("rsvps").insert([{
        event_id,
        name,
        email
      }]).select();
      
      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add RSVP error:", error);
      res.status(500).json({ error: "Failed to submit RSVP" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  const actualPort = await listenWithFallback(PORT);
  console.log(`Server running on http://localhost:${actualPort}`);
}

startServer();
