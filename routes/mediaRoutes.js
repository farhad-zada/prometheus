const router = require("express").Router();
const { saveImage, deleteImage } = require("../controllers/mediaController");

router.post(
  "/",
  require("../middlewares/mediaMiddleware"),
  saveImage
);

router.delete("/:imageName", deleteImage);
module.exports = router;
