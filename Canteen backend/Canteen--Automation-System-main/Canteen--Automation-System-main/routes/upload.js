const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken'); // ✅ REQUIRED

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || 'public/uploads';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const generateFilename = (prefix) =>
  `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}.jpg`;

router.post(
  '/items/upload-image',
  upload.single('image'),
  async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'No token provided' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test');
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      const folder = path.join(uploadDir, 'items');
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      const filename = generateFilename('item');
      const filepath = path.join(folder, filename);

      await sharp(req.file.buffer)
        .resize(300, 300)
        .jpeg({ quality: 70 })
        .toFile(filepath);

      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const fileUrl = `${baseUrl}/uploads/items/${filename}`;

      res.json({ url: fileUrl });


    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
