

import multer from "multer";
import sharp from "sharp";
import catchAsync from "./catchAsync.js";
import AppError from "./appError.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const uploadProductImages = upload.fields([
//   { name: 'imageCover', maxCount: 1 },
//   { name: 'images', maxCount: 3 }
// ])
 export const uploadCoverImage = upload.single("categoryImage");

export const resizeCoverImage = catchAsync(async (req, res, next) => {
  //console.log(req.file)

  req.body.categoryImage = `category-${req.user.id}-${Date.now()}-image.jpeg`;
  console.log(req.file.filename);
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/categories/${req.body.categoryImage}`);

  next();
});


