import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;
  private bucket: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.bucket = this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'sketches';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase Storage initialized');
  }

  async uploadImage(
    fileName: string,
    base64Data: string,
    folder: string = '',
  ): Promise<string> {
    try {
      const base64Content = base64Data.split(',')[1];
      const buffer = Buffer.from(base64Content, 'base64');
      const contentType = base64Data.split(';')[0].split(':')[1];
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(filePath, buffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        this.logger.error(`Failed to upload ${filePath}:`, error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: publicUrlData } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

      this.logger.log(`Uploaded: ${filePath}`);
      return publicUrlData.publicUrl;
    } catch (error) {
      this.logger.error('Upload error:', error);
      throw error;
    }
  }

  async deleteImage(fileUrl: string): Promise<void> {
    try {
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split(`/object/public/${this.bucket}/`);
      
      if (pathParts.length < 2) {
        throw new Error('Invalid file URL');
      }

      const filePath = pathParts[1];

      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([filePath]);

      if (error) {
        this.logger.error(`Failed to delete ${filePath}:`, error);
        throw new Error(`Delete failed: ${error.message}`);
      }

      this.logger.log(`Deleted: ${filePath}`);
    } catch (error) {
      this.logger.error('Delete error:', error);
      throw error;
    }
  }

  async deleteImages(fileUrls: string[]): Promise<void> {
    await Promise.all(fileUrls.map((url) => this.deleteImage(url)));
  }

  generateFileName(prefix: string = 'sketch', extension: string = 'png'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${prefix}_${timestamp}_${random}.${extension}`;
  }
}