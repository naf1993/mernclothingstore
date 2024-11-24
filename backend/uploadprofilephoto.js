import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import sharp from 'sharp';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import User from './models/userModel.js'; // Adjust to your user model path
import connectDB from './config/db.js';

dotenv.config();

// Cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

connectDB()
// Fetch random user image from RandomUser.me API
async function getRandomUserImage() {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    const imageUrl = response.data.results[0].picture.large; // Get the large image URL
    return imageUrl;
  } catch (error) {
    console.error("Error fetching random user image:", error);
    throw error;
  }
}

// Compress image using Sharp
async function compressImage(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const compressedImage = await sharp(response.data)
      .resize(500, 500) // Resize to 500x500 (optional)
      .webp({ quality: 80 }) // Convert to WebP and set quality to 80
      .toBuffer();
    return compressedImage;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}

// Upload compressed image to Cloudinary
async function uploadImageToCloudinary(imageBuffer) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { folder: 'user_profiles', resource_type: 'image', format: 'webp' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url); // Return the URL of the uploaded image
        }
      }
    ).end(imageBuffer);
  });
}

// Update all users with a random profile photo
async function updateUsersWithRandomProfilePictures() {
  try {
    const users = await User.find({}); // Fetch all users from the database
    for (let user of users) {
      const randomImageUrl = await getRandomUserImage(); // Get random image URL
      const compressedImageBuffer = await compressImage(randomImageUrl); // Compress the image
      const cloudinaryImageUrl = await uploadImageToCloudinary(compressedImageBuffer); // Upload to Cloudinary

      // Update the user's profile photo URL in the database
      await User.updateOne(
        { _id: user._id },
        { $set: { profilePhoto: cloudinaryImageUrl } }
      );

      console.log(`Updated user ${user._id} with a new profile photo.`);
    }
    console.log("Successfully updated all users with a random profile photo.");
  } catch (error) {
    console.error("Error updating users:", error);
  }
}

// Run the update function
updateUsersWithRandomProfilePictures();
