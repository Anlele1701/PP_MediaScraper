import { Request, Response } from "express";
import { MediaService } from "../services/MediaService";

export class MediaController {
  constructor(private readonly mediaService = new MediaService()) {}

  async scrape(req: Request, res: Response) {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "urls array is required" });
    }

    // const results = await this.mediaService.scrapeWebPage(urls);
    res.json({ null: "yes" });
  }
}
