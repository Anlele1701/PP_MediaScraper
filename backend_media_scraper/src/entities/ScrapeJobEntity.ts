// src/entities/ScrapeJob.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { WebPageEntity } from "./WebPageEntity";

@Entity({ name: "scrape_jobs" })
export class ScrapeJobEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  status: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @OneToMany(() => WebPageEntity, (page) => page.scrapeJob)
  webPages: WebPageEntity[];
}
