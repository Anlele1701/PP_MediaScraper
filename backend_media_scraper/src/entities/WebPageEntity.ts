import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ScrapeJobEntity } from "./ScrapeJobEntity";
import { MediaAssetEntity } from "./MediaAssetEntity";

@Entity({ name: "web_pages" })
export class WebPageEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  status: string;

  @Column({ name: "error_message", nullable: true })
  errorMessage?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => ScrapeJobEntity, (job) => job.webPages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "scrape_job_id" })
  scrapeJob: ScrapeJobEntity;

  @OneToMany(() => MediaAssetEntity, (media) => media.webPage)
  mediaAssets: MediaAssetEntity[];
}
