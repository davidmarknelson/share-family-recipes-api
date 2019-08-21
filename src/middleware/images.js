'use strict';
const multer  = require('multer');
const Jimp = require('jimp');

const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/profilePics');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.username}.jpeg`);
  }
});

const storageMeal = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/mealPics');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.name}.jpeg`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Please upload a JPEG image.'), false);
  }
};

const uploadProfilePic = multer({
  storage: storageProfile,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1
  },
  fileFilter: fileFilter
});

const uploadMealPic = multer({
  storage: storageMeal,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1
  },
  fileFilter: fileFilter
});

module.exports = {
  resizeImage: async (req, res, next) => {
    try {
      if (!req.file) return next();
      
      let image = await Jimp.read(req.file.path)
        .then(image => image.quality(70).write(req.file.path)
      );

      next();
    } catch (err) {
      res.status(500).json({ message: 'There was an error with your image.'})
    }
  },
  uploadProfilePic: uploadProfilePic.single('profilePic'),
  uploadMealPic: uploadMealPic.single('mealPic')
};