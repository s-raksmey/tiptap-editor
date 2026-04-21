export type S3UploadOptions = {
  key: string;
  buffer: Uint8Array;
  mime: string;
};

export type S3Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

export type S3ConnectionConfig = {
  credentials: S3Credentials;
  endpoint: string;
  region?: string;
};

export type S3Config = {
  s3: {
    bucket: string;
    publicUrl: string;
    endpoint: string;
    region?: string;
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
};
