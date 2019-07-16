import {Injectable} from '@angular/core';
import {readdirSync, mkdirSync, existsSync} from 'fs';
import {FileExtensionService} from './file-extension.service';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private fileExtensionService: FileExtensionService) {
  }

  imagesPath(path: string) {
    const fileNames = readdirSync(path);
    const filePaths = fileNames.map(fileName => `${path}/${fileName}`);

    return filePaths.filter(filePath => this.isDotTifImage(filePath));
  }

  isDotTifImage(path: string) {
    return path.endsWith(this.fileExtensionService.dotTif());
  }

  exists(path: string) {
    return existsSync(path);
  }

  createIfNotExists(path: string) {
    if(this.exists(path)) {
      return;
    }

    this.create(path);
  }

  create(path: string) {
    mkdirSync(path);
  }
}
