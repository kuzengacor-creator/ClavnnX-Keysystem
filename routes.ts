import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { verifyKeySchema, type VerificationResponse, type GetKeyResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate key endpoint
  app.post("/api/generate-key", async (req, res) => {
    try {
      const keyData = await storage.generateKey();
      res.json(keyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate key" });
    }
  });

  // Get current key endpoint
  app.get("/api/current-key", async (req, res) => {
    try {
      const keyData = await storage.getStoredKey();
      if (!keyData) {
        return res.status(404).json({ message: "No key found" });
      }
      res.json(keyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve key" });
    }
  });

  // Get key endpoint for Autoscale deployment
  app.get("/get-key", async (req, res) => {
    try {
      const keyData = await storage.getCurrentKey();
      const currentTime = Math.floor(Date.now() / 1000);
      
      const response: GetKeyResponse = {
        key: keyData.key,
        expire_time: keyData.expired,
        status: currentTime > keyData.expired ? "expired" : "valid"
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error in /get-key endpoint:", error);
      res.status(500).json({ message: "Failed to retrieve key" });
    }
  });

  // Verify key endpoint
  app.get("/verify", async (req, res) => {
    try {
      const { key } = verifyKeySchema.parse(req.query);
      const result = await storage.verifyKey(key);
      
      let response: VerificationResponse;
      
      switch (result) {
        case "valid":
          response = { status: "valid", message: "Key valid" };
          break;
        case "invalid":
          response = { status: "invalid", message: "Invalid key" };
          break;
        case "expired":
          response = {
            status: "expired",
            message: "Key expired",
            redirect: "https://linkvertise.com/your-first-step"
          };
          // Redirect on expired key as requested
          return res.redirect("https://linkvertise.com/your-first-step");
        default:
          response = { status: "invalid", message: "Invalid key" };
      }
      
      res.json(response);
    } catch (error) {
      res.status(400).json({ status: "invalid", message: "Invalid key" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
