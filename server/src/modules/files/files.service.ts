import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export type FileDestination =
  | 'products'
  | 'reviews'
  | 'users'
  | 'brands'
  | 'banners';

@Injectable()
export class FilesService {
  private readonly logger: Logger = new Logger('FileService');

  async saveFile(
    image: Express.Multer.File,
    destination: FileDestination = 'products',
  ): Promise<string | undefined> {
    try {
      const fileName: string = uuid.v4() + '.webp';
      const filePath: string = path.resolve(
        __dirname,
        '../..',
        'static',
        destination,
      );
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), image.buffer);
      return `${destination}/${fileName}`;
    } catch (error) {
      this.logger.error(
        `An error occurred while writing the file: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `An error occurred while writing the file, 
          ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      if (!url) {
        return;
      }

      const [destination, fileName] = url.split('/');

      const validDestinations: FileDestination[] = [
        'products',
        'reviews',
        'users',
        'brands',
        'banners',
      ];
      if (!validDestinations.includes(destination as FileDestination)) {
        throw new Error('Invalid file destination');
      }

      const filePath = path.resolve(
        __dirname,
        '../..',
        'static',
        destination,
        fileName,
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(
        `An error occurred while deleting the file: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `An error occurred while deleting the file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
