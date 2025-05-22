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
    
    // Sample APK files
    const sampleApks: Partial<ApkFile>[] = [
      {
        name: 'PUBG Mobile',
        description: 'Unlocked skins, unlimited UC, and aimbot features.',
        version: '1.5.0',
        category: 'games',
        size: '150MB',
        fileName: 'pubg_mobile_mod.apk',
        iconPath: '',
        rating: 48,
        downloads: 15000,
        userId: demoUser.id,
        isFeatured: true,
        isTrending: true,
      },
      {
        name: 'Spotify Premium',
        description: 'Unlimited skips, offline downloads, and high quality audio.',
        version: '8.7.5',
        category: 'music-audio',
        size: '85MB',
        fileName: 'spotify_premium_mod.apk',
        iconPath: '',
        rating: 49,
        downloads: 25000,
        userId: demoUser.id,
        isFeatured: false,
        isTrending: true,
      },
      {
        name: 'Adobe Lightroom Pro',
        description: 'All premium features unlocked, no subscription needed.',
        version: '6.4.0',
        category: 'utilities',
        size: '112MB',
        fileName: 'adobe_lightroom_mod.apk',
        iconPath: '',
        rating: 42,
        downloads: 9800,
        userId: demoUser.id,
        isFeatured: false,
        isTrending: true,
      },
      {
        name: 'Minecraft PE',
        description: 'God mode, unlimited resources, and all skins unlocked.',
        version: '1.19.2',
        category: 'games',
        size: '175MB',
        fileName: 'minecraft_pe_mod.apk',
        iconPath: '',
        rating: 47,
        downloads: 18700,
        userId: demoUser.id,
        isFeatured: false,
        isTrending: true,
      },
      {
        name: 'Netflix Premium',
        description: 'Premium subscription enabled, no account needed.',
        version: '8.21.0',
        category: 'entertainment',
        size: '95MB',
        fileName: 'netflix_premium_mod.apk',
        iconPath: '',
        rating: 46,
        downloads: 22000,
        userId: demoUser.id,
        isFeatured: true,
        isTrending: false,
      },
      {
        name: 'Instagram Pro',
        description: 'Download photos and videos, ad-free experience.',
        version: '235.0.1',
        category: 'social',
        size: '65MB',
        fileName: 'instagram_pro_mod.apk',
        iconPath: '',
        rating: 40,
        downloads: 13500,
        userId: demoUser.id,
        isFeatured: false,
        isTrending: false,
      },
      {
        name: 'YouTube Vanced',
        description: 'Ad-free, background playback, and premium features unlocked.',
        version: '17.33.42',
        category: 'entertainment',
        size: '78MB',
        fileName: 'youtube_vanced_mod.apk',
        iconPath: '',
        rating: 49,
        downloads: 35000,
        userId: demoUser.id,
        isFeatured: true,
        isTrending: false,
      },
      {
        name: 'Mobile Legends',
        description: 'Map hack, unlimited diamonds, and all skins unlocked.',
        version: '1.6.72',
        category: 'games',
        size: '145MB',
        fileName: 'mobile_legends_mod.apk',
        iconPath: '',
        rating: 42,
        downloads: 12000,
        userId: demoUser.id,
        isFeatured: false,
        isTrending: false,
      }
    ];
    
    // Add sample APKs to storage
    for (const apkData of sampleApks) {
      const id = this.apkIdCounter++;
      const now = new Date();
      now.setHours(now.getHours() - Math.floor(Math.random() * 72)); // Random upload time in the last 3 days
      
      const apk: ApkFile = {
        ...apkData,
        id,
        uploadedAt: now,
      } as ApkFile;
      
      this.apkFiles.set(id, apk);
      
      // Add features based on the app
      const features: ApkFeature[] = [];
      
      if (apk.name === 'PUBG Mobile') {
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'no-ads' });
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'anti-ban' });
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'unlimited-resources' });
      } else if (apk.name === 'Spotify Premium') {
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'no-ads' });
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'premium' });
      } else if (apk.name === 'Adobe Lightroom Pro') {
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'premium' });
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'pro-features' });
      } else if (apk.name === 'Minecraft PE') {
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'premium' });
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'unlimited-resources' });
      } else if (apk.name === 'Netflix Premium') {
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'premium' });
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'hd-support' });
      } else if (apk.name === 'Instagram Pro') {
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'no-ads' });
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'save-media' });
      } else if (apk.name === 'YouTube Vanced') {
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'no-ads' });
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'background-play' });
      } else if (apk.name === 'Mobile Legends') {
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'radar-hack' });
        features.push({ id: this.apkFeatureIdCounter++, apkId: id, feature: 'unlimited-resources' });
      }
      
      this.apkFeatures.set(id, features);
    }
  }
}

export const storage = new MemStorage();
