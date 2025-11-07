import express from "express";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "../controllers/ProfilePerusahaan.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  uploadPerusahaan,
  handleUploadError,
} from "../middleware/UploadPerusahaan.js";

const router = express.Router();

// Routes
router.get("/perusahaan", getProfile);
router.post(
  "/perusahaan",
  verifyToken,
  uploadPerusahaan.single("logo"),
  handleUploadError,
  createProfile
);
router.put(
  "/perusahaan",
  verifyToken,
  uploadPerusahaan.single("logo"),
  handleUploadError,
  updateProfile
);

export default router;
