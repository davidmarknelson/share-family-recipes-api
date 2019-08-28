'use strict';
const multer  = require('multer');
const Jimp = require('jimp');

// Multer settings
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Please upload a JPEG image.'), false);
  }
};

// Multer profile picture settings
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

const uploadProfilePic = multer({
  storage: storageProfile,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1
  },
  fileFilter: fileFilter
});

// Multer meal picture settings
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

const uploadMealPic = multer({
  storage: storageMeal,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1
  },
  fileFilter: fileFilter
});

// Jimp image quality functions
const fileSizeChart = [
  { minSize: 1500000, quality: 20 },
  { minSize: 500000, quality: 45 },
  { minSize: 0, quality: 70 }
]

function getQuality(fileSize) {
  let size = fileSizeChart.find((file) => fileSize >= file.minSize);

  return size.quality;
}

module.exports = {
  resizeImage: async (req, res, next) => {
    try {
      if (!req.file) return next();

      let quality = getQuality(req.file.size);

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