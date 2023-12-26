// import fs from 'fs'
// import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/appError.js";

// import { cloudinaryUploadImg,cloudinaryDeleteImg } from '../utils/cloudinary.js';

// export const uploadImages = catchAsync(async (req, res) => {
//     try {
//       const uploader = (path) => cloudinaryUploadImg(path, "images");
//       const urls = [];
//       const files = req.files;
//       for (const file of files) {
//         const { path } = file;
//         const newpath = await uploader(path);
//         console.log(newpath);
//         urls.push(newpath);
//         fs.unlinkSync(path,err=>console.log(err));
//       }
//       const images = urls.map((file) => {
//         return file;
//       });
//       res.json(images);
//     } catch (error) {
//       throw new Error(error);
//     }
//   });

//  export const deleteImages = catchAsync(async (req, res) => {
//     const { id } = req.params;
//     try {
//       const deleted = cloudinaryDeleteImg(id, "images");
//       res.json({ message: "Deleted" });
//     } catch (error) {
//       throw new Error(error);
//     }
//   });