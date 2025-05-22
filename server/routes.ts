import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { insertApkFileSchema } from "@shared/schema";

// Configure file storage for uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage_config,
  fileFilter: function(req, file, cb) {
    if (file.fieldname === 'apkFile' && path.extname(file.originalname) !== '.apk') {
      return cb(new Error('Only APK files are allowed!'));
    }
    if (file.fieldname === 'iconImage' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for icons!'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB max file size for APKs
  }
});

// Upload validation schema
const uploadSchema = insertApkFileSchema.extend({
  features: z.array(z.string()),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Serve static files from uploads directory
  app.use('/api/uploads', express.static(uploadsDir));
  
  // API routes
  
  // Get all APK files
  app.get('/api/apks', async (req: Request, res: Response) => {
    try {
      const apks = await storage.getApkFiles();
      res.json(apks);
    } catch (error) {
      console.error('Error getting APK files:', error);
      res.status(500).json({ message: 'Failed to get APK files' });
    }
  });
  
  // Get featured APK files
  app.get('/api/apks/featured', async (req: Request, res: Response) => {
    try {
      const apks = await storage.getFeaturedApkFiles();
      res.json(apks);
    } catch (error) {
      console.error('Error getting featured APK files:', error);
      res.status(500).json({ message: 'Failed to get featured APK files' });
    }
  });
  
  // Get trending APK files
  app.get('/api/apks/trending', async (req: Request, res: Response) => {
    try {
      const apks = await storage.getTrendingApkFiles();
      res.json(apks);
    } catch (error) {
      console.error('Error getting trending APK files:', error);
      res.status(500).json({ message: 'Failed to get trending APK files' });
    }
  });
  
  // Get latest APK files
  app.get('/api/apks/latest', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const apks = await storage.getLatestApkFiles(limit);
      res.json(apks);
    } catch (error) {
      console.error('Error getting latest APK files:', error);
      res.status(500).json({ message: 'Failed to get latest APK files' });
    }
  });
  
  // Get APK files by category
  app.get('/api/apks/category/:category', async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const apks = await storage.getApkFilesByCategory(category);
      res.json(apks);
    } catch (error) {
      console.error(`Error getting APK files for category ${req.params.category}:`, error);
      res.status(500).json({ message: 'Failed to get APK files for category' });
    }
  });
  
  // Search APK files
  app.get('/api/apks/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || '';
      const apks = await storage.searchApkFiles(query);
      res.json(apks);
    } catch (error) {
      console.error('Error searching APK files:', error);
      res.status(500).json({ message: 'Failed to search APK files' });
    }
  });
  
  // Get specific APK file
  app.get('/api/apks/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid APK ID' });
      }
      
      const apk = await storage.getApkFile(id);
      if (!apk) {
        return res.status(404).json({ message: 'APK not found' });
      }
      
      res.json(apk);
    } catch (error) {
      console.error(`Error getting APK with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to get APK file' });
    }
  });
  
  // Upload new APK file
  app.post('/api/apks', upload.fields([
    { name: 'apkFile', maxCount: 1 },
    { name: 'iconImage', maxCount: 1 }
  ]), async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.apkFile || !files.apkFile[0]) {
        return res.status(400).json({ message: 'APK file is required' });
      }
      
      const apkFile = files.apkFile[0];
      const iconImage = files.iconImage?.[0];
      
      // Validate body data
      const validationResult = uploadSchema.safeParse({
        ...req.body,
        fileName: apkFile.filename,
        iconPath: iconImage?.filename || '',
        features: req.body.features ? req.body.features.split(',') : [],
      });
      
      if (!validationResult.success) {
        // Clean up uploaded files if validation fails
        if (apkFile) fs.unlinkSync(apkFile.path);
        if (iconImage) fs.unlinkSync(iconImage.path);
        return res.status(400).json({ message: 'Invalid APK data', errors: validationResult.error.format() });
      }
      
      const apkData = validationResult.data;
      const features = apkData.features;
      delete apkData.features;
      
      // Create APK in storage
      const newApk = await storage.createApkFile(apkData, features);
      
      res.status(201).json(newApk);
    } catch (error) {
      console.error('Error uploading APK file:', error);
      res.status(500).json({ message: 'Failed to upload APK file' });
    }
  });
  
  // Download APK file (increment download count)
  app.get('/api/apks/:id/download', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid APK ID' });
      }
      
      const apk = await storage.getApkFile(id);
      if (!apk) {
        return res.status(404).json({ message: 'APK file not found' });
      }
      
      // Increment download count
      await storage.incrementDownloadCount(id);
      
      // Construct file path
      const filePath = path.join(uploadsDir, apk.fileName);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'APK file not found on server' });
      }
      
      // Set headers for the response
      res.setHeader('Content-Disposition', `attachment; filename="${apk.name.replace(/\s+/g, '_')}_${apk.version}.apk"`);
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      
      // Send the file
      res.sendFile(filePath);
    } catch (error) {
      console.error(`Error downloading APK with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to download APK file' });
    }
  });
  
  return httpServer;
}

// Make sure Express is properly imported
import express from "express";
