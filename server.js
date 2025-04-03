import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cors from 'cors';
import "dotenv/config";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', 
    resource_type: 'auto', 
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});


const upload = multer({ storage });

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({ fileUrl: req.file.path });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
