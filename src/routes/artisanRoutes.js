import express from "express";
import { getPublicArtisanProfile } from "../controllers/artisanController.js";

const router = express.Router();

router.get("/:id", getPublicArtisanProfile);

export default router;
