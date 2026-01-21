import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { WebPageEntity } from "./web-page.entity";

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

@Entity({ name: "media_assets" })
export class MediaAssetEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: MediaType,
  })
  type: MediaType;

  @Column({ name: "title", nullable: true })
  title?: string;

  @Column({ name: "media_url" })
  mediaUrl: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => WebPageEntity, (page) => page.mediaAssets, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "web_page_id" })
  webPage: WebPageEntity;
}
