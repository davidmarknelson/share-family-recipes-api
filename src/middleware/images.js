'use strict';
const multer  = require('multer');

const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images/profilePics');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.username}.jpeg`);
  }
});

const storageMeal = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images/mealPics');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.name}.jpeg`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Please upload a jpeg or png image.'), false);
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
  uploadProfilePic: uploadProfilePic.single('profilePic'),
  uploadMealPic: uploadMealPic.single('mealPic')
};