import {Injectable} from '@angular/core';
import {FolderService} from './folder.service';
import {ImageService} from './image.service';
import * as ConvertTiff from 'tiff-to-png';
import { ElectronService } from './electron.service';
import { AppConfig } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageConverterService {

  constructor(
    private folderService: FolderService, 
    private imageService: ImageService,
    private electronService: ElectronService,
  ) {
  }

  async tifToJpg(imagesPath: string[], jpegPath: string) {
    this.folderService.createIfNotExists(jpegPath);

    let convert = this.electronService.getAppRoot() + "/programs/macOS/ImageMagick-7.0.8/bin/convert";
    // if(AppConfig.production) {
    //   convert = this.electronService.remote.app.getAppPath() + "/../programs/macOS/ImageMagick-7.0.8/bin/convert";
    // }

    console.log(AppConfig.production, convert);

    var options = {
      type: 'jpg',
      commandPath: convert,
      logLevel: 1
    };

    var converter = new ConvertTiff(options);

    return await converter.convertArray(imagesPath, jpegPath);

    // imagesPath.forEach(path => {
    //   const fileName = basename(path);
    //   const buffer = readFileSync(path, 'utf8');
    //
    //   Jimp.read(buffer).then(image => {
    //     console.log(image);
    //     // const jpgBuffer = image.autocrop()
    //     //   .quality(100)
    //     //   .getBufferAsync(Jimp.MIME_JPEG);
    //     //
    //     // writeFileSync(`${jpegPath}/${fileName}`, jpgBuffer);
    //
    //     // sharp(jpgBuffer)
    //     //   .jpeg({
    //     //     quality: 100,
    //     //   })
    //     //   .background({r: 255, g: 255, b: 255, alpha: 1})
    //     //   .extend({top: 10, bottom: 20, left: 10, right: 10})
    //     //   .toFile(`${jpegPath}/${fileName}`, function (err) {
    //     //     console.error('Sharp error', err);
    //     //   });
    //   }).catch(err => {
    //     console.error('Jimp error', err);
    //   });
    // });


    // const converter = new ConvertTiff({
    //   type: 'jpg',
    // });
    //
    // return converter.convertArray(imagesPath, jpegPath);
  }
}
