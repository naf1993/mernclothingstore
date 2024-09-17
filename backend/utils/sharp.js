// middleware/resizeImage.js
import sharp from 'sharp';
import { Readable } from 'stream';

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export const resizeImageCloud = async (req, res, next) => {
  try {
    if (req.files) {
      const resizePromises = req.files.map(async (file) => {
        const buffer = await sharp(file.buffer).resize(500, 500).toBuffer(); // Resize image
        file.buffer = bufferToStream(buffer);
      });

      await Promise.all(resizePromises);
    }
    next();
  } catch (err) {
    next(err);
  }
};
