const sharp = require("sharp");

const optimizeImage = async (req, res, next) => {
  try {
    if (req.file) {
      await sharp(req.file.path)
        .resize({ width: 260 })
        .webp({ quality: 70 })
        .toFile(req.file.path.replace(/\.jpeg|\.jpg|\.png/g, "-") + "optimized.webp")


      // req.optimizedImagePath = optimizedImagePath;
      // console.log("Optimized image path:", optimizedImagePath);
      // if (req.body && req.body.imageUrl) {
      //   req.body.imageUrl = optimizedImagePath.replace(/\\/g, '/');
      // }
    }
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = optimizeImage;
