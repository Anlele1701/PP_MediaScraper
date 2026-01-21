import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "../config/logger";
import {
  isValidUrl,
  getAbsoluteUrl,
  getMediaType,
  isVideoEmbedUrl,
} from "../utils/media.utils";
import { AppDataSource } from "../config/data-source";
import { ScrapeJobEntity } from "../entities/scrape-job.entity";
import { WebPageEntity } from "../entities/web-page.entity";
import { MediaAssetEntity, MediaType } from "../entities/media-asset.entity";

export interface ScrapedMedia {
  url: string; // For absolute URLs
  type: "image" | "video";
  title?: string;
}

export interface ScrapeResult {
  pageTitle: string | null;
  itemScraped: number;
  mediaItems: ScrapedMedia[];
}

export interface PageScrapeOutcome {
  url: string;
  success: boolean;
  result?: ScrapeResult;
  error?: string;
}

export class MediaService {
  async scrapeMultiplePages(urls: string[]) {
    return AppDataSource.transaction(async (manager) => {
      const outcomes: PageScrapeOutcome[] = [];

      const job = manager.create(ScrapeJobEntity, { status: "RUNNING" });
      await manager.save(job);

      for (const url of urls) {
        try {
          const scrapeResult = await this.scrapeWebPage(url);

          const page = manager.create(WebPageEntity, {
            scrapeJob: job,
            url,
            title: scrapeResult.pageTitle ?? "Untitled",
            status: "SUCCESS",
          });
          await manager.save(page);

          const mediaEntities = scrapeResult.mediaItems.map((item) =>
            manager.create(MediaAssetEntity, {
              webPage: page,
              mediaUrl: item.url,
              title: item.title || null,
              type: item.type === "image" ? MediaType.IMAGE : MediaType.VIDEO,
            }),
          );

          await manager.save(mediaEntities);

          outcomes.push({
            url,
            success: true,
            result: scrapeResult,
          });
        } catch (error) {
          outcomes.push({
            url,
            success: false,
            error: error.message,
          });

          const failedPage = manager.create(WebPageEntity, {
            scrapeJob: job,
            url,
            title: "Failed",
            status: "FAILED",
            errorMessage: error.message,
          });

          await manager.save(failedPage);
        }
      }

      job.status = "COMPLETED";
      await manager.save(job);

      return outcomes;
    });
  }

  async scrapeWebPage(pageUrl: string): Promise<ScrapeResult> {
    try {
      const { data } = await axios.get(pageUrl, {
        timeout: 10000,
        // Advoid block by some websites
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      // load the HTML string into Cheerio
      const $ = cheerio.load(data);
      const pageTitle = $("title").first().text() || null;

      const mediaItems: ScrapedMedia[] = [];

      // Extract images
      $("img").each((_, el) => {
        const src = $(el).attr("src");
        const alt = $(el).attr("alt");
        if (src && isValidUrl(src)) {
          const absoluteUrl = getAbsoluteUrl(pageUrl, src);
          mediaItems.push({
            url: absoluteUrl,
            type: "image",
            title: alt || "Image",
          });
        }
      });

      // Extract video sources
      $("video source").each((_, el) => {
        const src = $(el).attr("src");
        if (src && isValidUrl(src)) {
          const absoluteUrl = getAbsoluteUrl(pageUrl, src);
          mediaItems.push({
            url: absoluteUrl,
            type: "video",
            title: "Video",
          });
        }
      });

      // Extract iframe videos (YouTube, Vimeo, etc.)
      $("iframe").each((_, el) => {
        const src = $(el).attr("src");
        if (src && isVideoEmbedUrl(src)) {
          mediaItems.push({
            url: src,
            type: "video",
            title: "Embedded Video",
          });
        }
      });

      // Extract links to media files
      $("a").each((_, el) => {
        const href = $(el).attr("href");
        if (href && isValidUrl(href)) {
          const absoluteUrl = getAbsoluteUrl(pageUrl, href);
          const type = getMediaType(absoluteUrl);
          if (type) {
            mediaItems.push({
              url: absoluteUrl,
              type,
              title: $(el).text() || "Media",
            });
          }
        }
      });

      // Remove duplicates
      const uniqueItems = Array.from(
        new Map(mediaItems.map((item) => [item.url, item])).values(),
      );

      logger.info(`Scraped ${uniqueItems.length} media items from ${pageUrl}`);
      return {
        pageTitle,
        itemScraped: uniqueItems.length,
        mediaItems: uniqueItems,
      };
    } catch (error) {
      logger.error(`Error scraping ${pageUrl}: ${error.message}`);
      throw error;
    }
  }
}
