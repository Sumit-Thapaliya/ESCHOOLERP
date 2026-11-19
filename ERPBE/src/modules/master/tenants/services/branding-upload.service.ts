import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.master.entity';

type ImageFile = { buffer: Buffer; size: number; mimetype: string };

@Injectable()
export class BrandingUploadService {
  constructor(
    @InjectRepository(Tenant) private tenants: Repository<Tenant>,
    private config: ConfigService,
  ) {}

  async upload(tenantId: string, file?: ImageFile) {
    if (!file || !Buffer.isBuffer(file.buffer) || file.size >= 5 * 1024 * 1024 || file.size !== file.buffer.length) {
      throw new BadRequestException('Choose an image smaller than 5 MB');
    }
    const png = file.mimetype === 'image/png' && file.buffer.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
    const jpg = file.mimetype === 'image/jpeg' && file.buffer.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'));
    if (!png && !jpg) throw new BadRequestException('Choose a PNG or JPG image');
    if (!(await this.tenants.exists({ where: { id: tenantId } }))) throw new NotFoundException('Tenant not found');

    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');
    if (!cloudName || !apiKey || !apiSecret) throw new ServiceUnavailableException('Image upload is not configured');
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });

    return new Promise<{ url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `school-branding/${tenantId}`, resource_type: 'image', allowed_formats: ['png', 'jpg'], timeout: 60000 },
        (error, result) => {
          if (error || !result?.secure_url || !result.secure_url.startsWith('https://')) {
            reject(new ServiceUnavailableException('Image upload failed. Please try again.'));
          } else {
            resolve({ url: result.secure_url });
          }
        },
      );
      stream.on('error', () => reject(new ServiceUnavailableException('Image upload failed. Please try again.')));
      stream.end(file.buffer);
    });
  }
}
