import {Injectable} from '@angular/core';
import {FolderService} from './folder.service';
import {ImageService} from './image.service';
import * as ConvertTiff from 'tiff-to-png';
import { ElectronService } from './electron.service';
import { AppConfig } from '../../environments/environment';
import { ImagemagickPathService } from './imagemagick-path.service';

@Injectable({
  providedIn: 'root'
})
export class ImageConverterService {

  constructor(
    private folderService: FolderService,
    private imageService: ImageService,
    private electronService: ElectronService,
    private imagemagickPathService: ImagemagickPathService,
  ) {
  }

  async tifToJpg(imagesPath: string[], jpegPath: string, imagemagickPath: string) {
    this.folderService.createIfNotExists(jpegPath);

    const options = {
      type: 'jpg',
      commandPath: imagemagickPath,
      logLevel: 1
    };

    const converter = new ConvertTiff(options);

    return await converter.convertArray(imagesPath, jpegPath);
  }
}
