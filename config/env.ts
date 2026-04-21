function withProtocol(value?: string) {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
}

export const env = {
  server: {
    s3: {
      bucket: process.env.R2_BUCKET,
      publicUrl: withProtocol(process.env.R2_PUBLIC_URL),
      endpoint: withProtocol(process.env.R2_URL),
      region: process.env.REGION || "auto",
      accessKeyId: process.env.R2_ACCESS_KEY,
      secretAccessKey: process.env.R2_SECRET_KEY,
    },
  },
};
