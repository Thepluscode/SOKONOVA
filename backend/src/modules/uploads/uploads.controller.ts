import {
    Controller,
    Post,
    Body,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

interface GetUploadUrlDto {
    filename: string;
    contentType: string;
    folder?: string;
}

/**
 * UploadsController
 *
 * Handles file upload operations using presigned URLs
 *
 * Endpoints:
 * - POST /uploads/presigned-url - Get a presigned URL for direct S3 upload
 */
@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    /**
     * Get a presigned URL for browser-based file upload
     *
     * The frontend can use this URL to upload directly to S3/R2
     * without sending the file through our server.
     *
     * Example request:
     * POST /uploads/presigned-url
     * {
     *   "filename": "product-image.jpg",
     *   "contentType": "image/jpeg",
     *   "folder": "products"
     * }
     *
     * Response:
     * {
     *   "uploadUrl": "https://s3.../presigned-url",
     *   "fileKey": "products/abc123.jpg",
     *   "publicUrl": "https://cdn.../products/abc123.jpg"
     * }
     */
    @Post('presigned-url')
    async getPresignedUrl(@Body() dto: GetUploadUrlDto) {
        if (!dto.filename || !dto.contentType) {
            throw new BadRequestException('filename and contentType are required');
        }

        try {
            return await this.uploadsService.getPresignedUploadUrl(
                dto.filename,
                dto.contentType,
                dto.folder ? { folder: dto.folder } : {},
            );
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * Get a presigned URL for viewing/downloading a file
     */
    @Post('download-url')
    async getDownloadUrl(@Body() dto: { fileKey: string }) {
        if (!dto.fileKey) {
            throw new BadRequestException('fileKey is required');
        }

        const url = await this.uploadsService.getPresignedDownloadUrl(dto.fileKey);
        return { downloadUrl: url };
    }
}
