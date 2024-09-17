

import dotenv from 'dotenv';
import colors from 'colors';
import app from './app.js'
import connectDB from './config/db.js';
import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
          






dotenv.config();
connectDB();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
      folder: 'ecommerce-products',
      allowed_formats: ['jpg', 'png'],
    },
  });
  
  const upload = multer({ storage });
  
  export { upload, cloudinary };
  
//export const uploadFilesCloud = file => cloudinary.v2.uploader.upload(file)


const PORT = process.env.PORT || 5000

app.listen(PORT,console.log( `server running in ${process.env.NODE_ENV} port ${PORT}`.yellow.bold));


