'use strict';
const multer  = require('multer');
const Jimp = require('jimp');

const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/profilePics');
  },
  filename: (req, file, cb) => {
    if (req.body.username.includes(' ')) {
      cb(new Error('Username must not include a space.'), false);
    } else if (req.body.username.length < 5 || req.body.username.length > 15) {
      cb(new Error('Username must be between 5 and 15 characters.'), false);
    } else {
      cb(null, `${req.body.username}.jpeg`);
    }  
  }
});

const storageMeal = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/mealPics');
  },
  filename: (req, file, cb) => {
    let name;
    if (req.body.name.includes(' ')) {
      name = req.body.name.replace(/\s+/g, '-');
    } else {
      name = req.body.name;
    }
    cb(null, `${name}.jpeg`);
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

      let quality;
      if (req.file.size < 500000) {
        quality = 70;
      } else if (req.file.size > 500000 && req.file.size < 1500000) {
        quality = 45;
      } else {
        quality = 20;
      }

      let image = await Jimp.read(req.file.path)
        .then(image => image.quality(quality).write(req.file.path)
      );

      next();
    } catch (err) {
      res.status(500).json({ message: 'There was an error with your image.'})
    }
  },
  uploadProfilePic: uploadProfilePic.single('profilePic'),
  uploadMealPic: uploadMealPic.single('mealPic')
};