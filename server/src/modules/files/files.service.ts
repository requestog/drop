import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(image: Express.Multer.File): Promise<string | undefined> {
    try {
      const fileName: string = uuid.v4() + '.webp';
      const filePath: string = path.resolve(__dirname, '../..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), image.buffer);
      return fileName;
    } catch (error) {
      throw new HttpException(
        `An error occurred while writing the file, 
          ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
