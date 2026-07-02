import { Inject } from '@nestjs/common';
import { S3_CLIENT } from '../providers/s3-client.provider';

export const InjectS3Client = () => Inject(S3_CLIENT);
