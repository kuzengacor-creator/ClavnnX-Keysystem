import { type Key } from "@shared/schema";
import Database from "@replit/database";

export interface IStorage {
  generateKey(): Promise<Key>;
  getStoredKey(): Promise<Key | null>;
  verifyKey(key: string): Promise<"valid" | "invalid" | "expired">;
  getCurrentKey(): Promise<Key>;
}

export class ReplDBStorage implements IStorage {
  private db: Database;
  private readonly KEY_STORAGE_NAME = "current_key";

  constructor() {
    this.db = new Database();
  }

  private generateRandomKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 16; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  async generateKey(): Promise<Key> {
    const key = this.generateRandomKey();
    const expired = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours from now
    
    const keyData: Key = { key, expired };
    
    try {
      // Store as JSON string for better compatibility
      await this.db.set(this.KEY_STORAGE_NAME, JSON.stringify(keyData));
      return keyData;
    } catch (error) {
      console.error("Error storing key in ReplDB:", error);
      throw new Error("Failed to generate key");
    }
  }

  async getStoredKey(): Promise<Key | null> {
    try {
      const result = await this.db.get(this.KEY_STORAGE_NAME);
      
      if (!result) {
        return null;
      }
      
      // ReplDB returns {ok: true, value: data} format
      if (typeof result === 'object' && 'ok' in result && result.ok && 'value' in result) {
        const data = result.value;
        
        // Handle both string (JSON) and object formats
        if (typeof data === 'string') {
          try {
            const keyData = JSON.parse(data) as Key;
            return keyData;
          } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            return null;
          }
        } else if (typeof data === 'object' && data && 'key' in data && 'expired' in data) {
          const keyData = data as Key;
          return keyData;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error retrieving key from ReplDB:", error);
      return null;
    }
  }

  async getCurrentKey(): Promise<Key> {
    const storedKey = await this.getStoredKey();
    const currentTime = Math.floor(Date.now() / 1000);

    // If no key exists or key is expired, generate a new one
    if (!storedKey || currentTime > storedKey.expired) {
      return await this.generateKey();
    }

    // Return existing valid key
    return storedKey;
  }

  async verifyKey(key: string): Promise<"valid" | "invalid" | "expired"> {
    const storedKey = await this.getStoredKey();
    
    if (!storedKey || storedKey.key !== key) {
      return "invalid";
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > storedKey.expired) {
      return "expired";
    }
    
    return "valid";
  }
}

export const storage = new ReplDBStorage();
