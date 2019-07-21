import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { FolderService } from './folder.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private folderService: FolderService) {
  }

  autoCrop(imagePath: string, outputPath: string, fileName: string) {
    this.folderService.createIfNotExists(outputPath);
    outputPath = `${outputPath}/${fileName}`;

    return ipcRenderer.sendSync('crop-image', {
      imagePath: imagePath,
      outputPath: outputPath,
    });
  }
}
