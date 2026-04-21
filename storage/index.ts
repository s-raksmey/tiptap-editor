import { env } from "@/config/env";
import { S3Storage } from "@/storage/s3.storage";

export const s3Storage = new S3Storage({
  s3: {
    bucket: env.server.s3.bucket!,
    publicUrl: env.server.s3.publicUrl!,
    endpoint: env.server.s3.endpoint!,
    region: env.server.s3.region || "auto",
    credentials: {
      accessKeyId: env.server.s3.accessKeyId!,
      secretAccessKey: env.server.s3.secretAccessKey!,
    },
  },
});
