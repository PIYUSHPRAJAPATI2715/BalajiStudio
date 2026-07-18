const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || '191788218421671',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dPvGlH1jF7XjNy_Yol_4GPxCRo4',
  secure: true,
});

module.exports = cloudinary;
