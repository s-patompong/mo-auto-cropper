import { Component, OnInit } from '@angular/core';
import { FolderService } from '../../providers/folder.service';
import { ImageService } from '../../providers/image.service';
import { ImageConverterService } from '../../providers/image-converter.service';
import { basename } from 'path';
import { ImagemagickPathService } from '../../providers/imagemagick-path.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {

  sourcePath = '';
  outputPath = '';
  jpegPath = '';
  imagesPath: string[] = [];
  outputResult: string[] = [];

  tifToJpegResult: any;

  processResult: string[] = [];
  step = 0;
  cropMessage = '';

  converting = false;
  imagemagickPathExists = false;
  imagemagickPath = '';
  updatingImagemagickPath = false;
  updatedImagemagickPath = false;

  successConvert = [];

  constructor(
    public folderService: FolderService,
    public imageService: ImageService,
    public imageConverter: ImageConverterService,
    public imagemagickPathService: ImagemagickPathService,
  ) {
  }

  ngOnInit() {
    this.imagemagickPathService.exists(exists => {
      this.imagemagickPathExists = exists;

      if (this.imagemagickPathExists) {
        this.getImagemagickPath();
      }
    });
  }

  getImagemagickPath() {
    this.imagemagickPathService.get(value => {
      this.imagemagickPath = value;
    });
  }

  change(element: HTMLInputElement) {
    this.sourcePath = element.files[ 0 ].path;
    this.outputPath = this.sourcePath + '/output';
    this.jpegPath = this.sourcePath + '/jpeg';
  }

  list() {
    this.imagesPath = this.folderService.imagesPath(this.sourcePath);
    this.step = 1;
  }

  async convert() {
    this.outputResult = [];
    this.successConvert = [];

    this.converting = true;
    this.tifToJpegResult = await this.imageConverter.tifToJpg(this.imagesPath, this.jpegPath, this.imagemagickPath);
    for (let i = 0; i < this.tifToJpegResult.converted.length; i++) {
      this.tifToJpegResult.converted[ i ].real_file_path = this.convertedRealFilePath(this.tifToJpegResult.converted[ i ]);
      this.tifToJpegResult.converted[ i ].real_file_name = this.convertedRealFileName(this.tifToJpegResult.converted[ i ]);

      if (this.tifToJpegResult.converted[ i ].success) {
        this.successConvert.push(this.tifToJpegResult.converted[ i ]);
      }
    }
    this.converting = false;
    this.step = 2;
  }

  crop() {
    this.outputResult = [];
    const convertedCount = this.successConvert.length;

    this.cropMessage = '';

    this.successConvert.forEach(converted => {
      console.log(`Cropping ${converted.real_file_name}`);
      const outputPath = this.imageService.autoCrop(
        converted.real_file_path,
        this.outputPath,
        converted.real_file_name,
      );
      this.outputResult.push(outputPath);
      console.log(`Finished cropping ${converted.real_file_name}`);
    });

    this.cropMessage = '';

    this.step = 3;
  }

  convertedRealFilePath(converted: any) {
    return converted.filename.replace('%d', 0);
  }

  convertedRealFileName(converted: any) {
    return basename(converted.target) + '.jpeg';
  }

  updateImagemagickPath() {
    this.updatedImagemagickPath = false;
    this.updatingImagemagickPath = true;
    this.imagemagickPathService.update(this.imagemagickPath, (success) => {
      this.updatingImagemagickPath = false;
      this.updatedImagemagickPath = true;
      this.getImagemagickPath();
    });
  }
}
