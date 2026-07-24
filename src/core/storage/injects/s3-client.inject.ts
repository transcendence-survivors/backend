import { Inject } from '@nestjs/common';
import { S3_CLIENT, S3_PUBLIC_CLIENT } from '../providers/s3-client.provider';

export const InjectS3Client = () => Inject(S3_CLIENT);
export const InjectS3PublicClient = () => Inject(S3_PUBLIC_CLIENT);
