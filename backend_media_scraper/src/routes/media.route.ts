import express from "express";
import { MediaController } from "../controllers/MediaController";

const router = express.Router();
const mediaController = new MediaController();

router.post("/scrape", mediaController.scrape);

module.exports = router;
