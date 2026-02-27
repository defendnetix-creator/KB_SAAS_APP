import dotenv from "dotenv";
// Load environment variables immediately
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./server/routes/auth.ts";
import articleRoutes from "./server/routes/articles.ts";
import categoryRoutes from "./server/routes/categories.ts";
import userRoutes from "./server/routes/users.ts";
import prisma from "./server/config/db.ts";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ WARNING: DATABASE_URL is not set. Database features will not work.");
}

async function seedDefaultCategories() {
  try {
    const organizations = await prisma.organization.findMany();
    
    if (organizations.length === 0) {
      console.log("🌱 Creating default organization for seeding...");
      const org = await prisma.organization.create({
        data: {
          name: "Enterprise Corp",
          slug: "enterprise-corp"
        }
      });
      organizations.push(org);
    }

    console.log(`🌱 Checking for default categories across ${organizations.length} organizations...`);
    const defaultCategories = [
      { name: "Servers", description: "On-premise hardware, virtual machines, and server management.", icon: "server" },
      { name: "Networking", description: "VPN, Switch configurations, WLAN, and internal network guides.", icon: "network" },
      { name: "Office 365", description: "Exchange Online, Teams, SharePoint, and Entra ID management.", icon: "cloud" },
      { name: "Hardware", description: "Asset tracking, peripheral troubleshooting, and hardware support.", icon: "hard-drive" },
      { name: "Security", description: "Threat mitigation protocols, compliance standards, and security audits.", icon: "security" },
      { name: "Mobile Devices", description: "Legacy documentation for enterprise mobile device management.", icon: "mobile" }
    ];

    for (const org of organizations) {
      for (const cat of defaultCategories) {
        const existing = await prisma.category.findFirst({
          where: { name: cat.name, organizationId: org.id }
        });

        if (!existing) {
          await prisma.category.create({
            data: {
              ...cat,
              organizationId: org.id
            }
          });
          console.log(`✅ Seeded category: ${cat.name} for org ${org.name}`);
        }
      }
    }
    console.log("✅ Category check complete.");
  } catch (err) {
    console.error("❌ Failed to seed categories:", err);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security & Logging Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for Vite dev server compatibility
  }));
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // API Routes
  app.get("/api/health", async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ 
        status: "ok", 
        database: "connected",
        timestamp: new Date().toISOString() 
      });
    } catch (err: any) {
      res.status(500).json({ 
        status: "error", 
        database: "disconnected",
        error: err.message,
        timestamp: new Date().toISOString() 
      });
    }
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/users", userRoutes);

  // Test Database Connection
  try {
    await prisma.$connect();
    console.log("✅ Database connection established successfully.");
  } catch (dbErr: any) {
    console.error("❌ Database connection failed:", dbErr.message);
    // Don't exit, but log clearly
  }

  // Seed default data
  await seedDefaultCategories();

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
