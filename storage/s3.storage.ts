import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type { S3Config, S3UploadOptions } from "@/types/storage";

export class S3Storage {
  private client: S3Client;
  private bucket: string;
  public readonly publicUrl: string;

  constructor(opts: S3Config) {
    const s3 = opts.s3;

    if (!s3.bucket) {
      throw new Error("Missing S3 bucket");
    }

    if (!s3.publicUrl) {
      throw new Error("Missing S3 public URL");
    }

    if (!s3.endpoint) {
      throw new Error("Missing S3 endpoint");
    }

    if (!s3.credentials?.accessKeyId) {
      throw new Error("Missing S3 access key");
    }

    if (!s3.credentials?.secretAccessKey) {
      throw new Error("Missing S3 secret key");
    }

    this.client = new S3Client({
      region: s3.region || "auto",
      endpoint: s3.endpoint,
      credentials: {
        accessKeyId: s3.credentials.accessKeyId,
        secretAccessKey: s3.credentials.secretAccessKey,
      },
      forcePathStyle: true,
    });

    this.bucket = s3.bucket;
    this.publicUrl = s3.publicUrl.replace(/\/$/, "");
  }

  async upload(opts: S3UploadOptions): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: opts.key,
        Body: opts.buffer,
        ContentType: opts.mime,
      }),
    );

    return `${this.publicUrl}/${opts.key}`;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
