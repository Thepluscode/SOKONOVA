import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export interface UploadConfig {
    maxSizeBytes: number;
    allowedMimeTypes: string[];
    folder: string;
}

const DEFAULT_CONFIG: UploadConfig = {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    folder: 'products',
};

@Injectable()
export class UploadsService {
    private readonly logger = new Logger(UploadsService.name);
    private readonly s3Client: S3Client | null;
    private readonly bucketName: string;
    private readonly publicUrl: string;

    constructor() {
        const endpoint = process.env.S3_ENDPOINT;
        const accessKeyId = process.env.S3_ACCESS_KEY_ID;
        const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
        this.bucketName = process.env.S3_BUCKET_NAME || 'sokonova-uploads';
        this.publicUrl = process.env.S3_PUBLIC_URL || endpoint || '';

        if (endpoint && accessKeyId && secretAccessKey) {
            this.s3Client = new S3Client({
                endpoint,
                region: process.env.S3_REGION || 'auto',
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
                forcePathStyle: true, // Required for Cloudflare R2
            });
            this.logger.log('S3/R2 client initialized');
        } else {
            this.s3Client = null;
            this.logger.warn('S3 credentials not configured. Uploads will return mock URLs.');
        }
    }

    /**
     * Generate a presigned URL for direct browser upload
     * This allows the frontend to upload directly to S3/R2 without going through the backend
     */
    async getPresignedUploadUrl(
        filename: string,
        contentType: string,
        config: Partial<UploadConfig> = {},
    ): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string }> {
        const { folder, allowedMimeTypes } = { ...DEFAULT_CONFIG, ...config };

        // Validate content type
        if (!allowedMimeTypes.includes(contentType)) {
            throw new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`);
        }

        // Generate unique file key
        const extension = filename.split('.').pop() || 'jpg';
        const fileKey = `${folder}/${uuidv4()}.${extension}`;

        if (!this.s3Client) {
            // Mock response for development without S3
            return {
                uploadUrl: `https://mock-s3.local/upload/${fileKey}`,
                fileKey,
                publicUrl: `https://via.placeholder.com/400x400?text=${encodeURIComponent(filename)}`,
            };
        }

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600, // 1 hour
        });

        const publicUrl = `${this.publicUrl}/${fileKey}`;

        this.logger.log(`Generated presigned URL for ${fileKey}`);

        return {
            uploadUrl,
            fileKey,
            publicUrl,
        };
    }

    /**
     * Generate a presigned URL for downloading/viewing a file
     */
    async getPresignedDownloadUrl(fileKey: string): Promise<string> {
        if (!this.s3Client) {
            return `https://via.placeholder.com/400x400?text=image`;
        }

        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
        });

        return getSignedUrl(this.s3Client, command, {
            expiresIn: 3600 * 24, // 24 hours
        });
    }

    /**
     * Upload a file directly from the backend (for server-side processing)
     */
    async uploadFile(
        buffer: Buffer,
        filename: string,
        contentType: string,
        config: Partial<UploadConfig> = {},
    ): Promise<{ fileKey: string; publicUrl: string }> {
        const { folder, maxSizeBytes, allowedMimeTypes } = { ...DEFAULT_CONFIG, ...config };

        // Validate
        if (buffer.length > maxSizeBytes) {
            throw new Error(`File too large. Max size: ${maxSizeBytes / 1024 / 1024}MB`);
        }

        if (!allowedMimeTypes.includes(contentType)) {
            throw new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`);
        }

        const extension = filename.split('.').pop() || 'jpg';
        const fileKey = `${folder}/${uuidv4()}.${extension}`;

        if (!this.s3Client) {
            return {
                fileKey,
                publicUrl: `https://via.placeholder.com/400x400?text=${encodeURIComponent(filename)}`,
            };
        }

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
            Body: buffer,
            ContentType: contentType,
        });

        await this.s3Client.send(command);

        const publicUrl = `${this.publicUrl}/${fileKey}`;

        this.logger.log(`Uploaded file: ${fileKey}`);

        return {
            fileKey,
            publicUrl,
        };
    }
}
