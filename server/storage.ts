import { 
  users, type User, type InsertUser, 
  apkFiles, type ApkFile, type InsertApkFile, 
  apkFeatures, type ApkFeature, type InsertApkFeature,
  type ApkFileWithFeatures
} from "@shared/schema";
import path from "path";
import fs from "fs";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // APK file methods
  getApkFile(id: number): Promise<ApkFileWithFeatures | undefined>;
  getApkFiles(): Promise<ApkFileWithFeatures[]>;
  getApkFilesByCategory(category: string): Promise<ApkFileWithFeatures[]>;
  searchApkFiles(query: string): Promise<ApkFileWithFeatures[]>;
  getFeaturedApkFiles(): Promise<ApkFileWithFeatures[]>;
  getTrendingApkFiles(): Promise<ApkFileWithFeatures[]>;
  getLatestApkFiles(limit?: number): Promise<ApkFileWithFeatures[]>;
  createApkFile(apk: InsertApkFile, apkFeatures: string[]): Promise<ApkFileWithFeatures>;
  incrementDownloadCount(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private apkFiles: Map<number, ApkFile>;
  private apkFeatures: Map<number, ApkFeature[]>;
  private userIdCounter: number;
  private apkIdCounter: number;
  private apkFeatureIdCounter: number;
  private uploadDir: string;

  constructor() {
    this.users = new Map();
    this.apkFiles = new Map();
    this.apkFeatures = new Map();
    this.userIdCounter = 1;
    this.apkIdCounter = 1;
    this.apkFeatureIdCounter = 1;
    
    // Create uploads directory if it doesn't exist
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    
    // Add some initial data
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // APK file methods
  async getApkFile(id: number): Promise<ApkFileWithFeatures | undefined> {
    const apk = this.apkFiles.get(id);
    if (!apk) return undefined;
    
    const features = this.apkFeatures.get(id) || [];
    return {
      ...apk,
      features: features.map(feature => feature.feature),
    };
  }
  
  async getApkFiles(): Promise<ApkFileWithFeatures[]> {
    return Array.from(this.apkFiles.values()).map(apk => {
      const features = this.apkFeatures.get(apk.id) || [];
      return {
        ...apk,
        features: features.map(feature => feature.feature),
      };
    });
  }
  
  async getApkFilesByCategory(category: string): Promise<ApkFileWithFeatures[]> {
    return Array.from(this.apkFiles.values())
      .filter(apk => apk.category === category)
      .map(apk => {
        const features = this.apkFeatures.get(apk.id) || [];
        return {
          ...apk,
          features: features.map(feature => feature.feature),
        };
      });
  }
  
  async searchApkFiles(query: string): Promise<ApkFileWithFeatures[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.apkFiles.values())
      .filter(apk => 
        apk.name.toLowerCase().includes(lowerQuery) ||
        apk.description.toLowerCase().includes(lowerQuery)
      )
      .map(apk => {
        const features = this.apkFeatures.get(apk.id) || [];
        return {
          ...apk,
          features: features.map(feature => feature.feature),
        };
      });
  }
  
  async getFeaturedApkFiles(): Promise<ApkFileWithFeatures[]> {
    return Array.from(this.apkFiles.values())
      .filter(apk => apk.isFeatured)
      .map(apk => {
        const features = this.apkFeatures.get(apk.id) || [];
        return {
          ...apk,
          features: features.map(feature => feature.feature),
        };
      });
  }
  
  async getTrendingApkFiles(): Promise<ApkFileWithFeatures[]> {
    return Array.from(this.apkFiles.values())
      .filter(apk => apk.isTrending)
      .map(apk => {
        const features = this.apkFeatures.get(apk.id) || [];
        return {
          ...apk,
          features: features.map(feature => feature.feature),
        };
      });
  }
  
  async getLatestApkFiles(limit: number = 8): Promise<ApkFileWithFeatures[]> {
    return Array.from(this.apkFiles.values())
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, limit)
      .map(apk => {
        const features = this.apkFeatures.get(apk.id) || [];
        return {
          ...apk,
          features: features.map(feature => feature.feature),
        };
      });
  }
  
  async createApkFile(apk: InsertApkFile, features: string[]): Promise<ApkFileWithFeatures> {
    const id = this.apkIdCounter++;
    const now = new Date();
    
    const newApk: ApkFile = {
      ...apk,
      id,
      uploadedAt: now,
      downloads: 0,
      rating: 45, // Default 4.5 rating
      isFeatured: false,
      isTrending: false,
    };
    
    this.apkFiles.set(id, newApk);
    
    // Save features
    const apkFeatures: ApkFeature[] = features.map(feature => ({
      id: this.apkFeatureIdCounter++,
      apkId: id,
      feature: feature as any,
    }));
    
    this.apkFeatures.set(id, apkFeatures);
    
    return {
      ...newApk,
      features,
    };
  }
  
  async incrementDownloadCount(id: number): Promise<void> {
    const apk = this.apkFiles.get(id);
    if (apk) {
      apk.downloads += 1;
      this.apkFiles.set(id, apk);
    }
  }

  // Helper method to seed some initial data
  private seedData() {
    // Add a demo user
    const demoUser: User = {
      id: this.userIdCounter++,
      username: 'admin',
      password: 'admin123',
    };
    this.users.set(demoUser.id, demoUser);
    
    // We removed the sample APKs as requested by the user
    // The app will now only show user-uploaded APKs
  }
}

export const storage = new MemStorage();
