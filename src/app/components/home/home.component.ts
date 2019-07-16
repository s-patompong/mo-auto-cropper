import {Component, OnInit} from '@angular/core';
import {FolderService} from '../../providers/folder.service';
import {ImageService} from '../../providers/image.service';
import {ImageConverterService} from '../../providers/image-converter.service';
import {basename} from 'path';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sourcePath: string = '';
  outputPath: string = '';
  jpegPath: string = '';
  imagesPath: string[] = [];
  outputResult: string[] = [];

  tifToJpegResult: any;

  processResult: string[] = [];
  step: number = 0;
  cropMessage: string = '';

  converting: boolean = false;

  constructor(
    public folderService: FolderService,
    public imageService: ImageService,
    public imageConverter: ImageConverterService,
  ) {
  }

  ngOnInit() {
  }

  change(element: HTMLInputElement) {
    this.sourcePath = element.files[0].path;
    this.outputPath = this.sourcePath + '/output';
    this.jpegPath = this.sourcePath + '/jpeg';
  }

  list() {
    this.imagesPath = this.folderService.imagesPath(this.sourcePath);
    this.step = 1;
  }

  async convert() {
    this.outputResult = [];

    this.converting = true;
    this.tifToJpegResult = await this.imageConverter.tifToJpg(this.imagesPath, this.jpegPath);
    console.log(this.tifToJpegResult);
    for (let i = 0; i < this.tifToJpegResult.converted.length; i++) {
      this.tifToJpegResult.converted[i].real_file_path = this.convertedRealFilePath(this.tifToJpegResult.converted[i]);
      this.tifToJpegResult.converted[i].real_file_name = this.convertedRealFileName(this.tifToJpegResult.converted[i]);
    }
    this.converting = false;
    this.step = 2;
  }

  crop() {
    this.outputResult = [];
    const convertedCount = this.tifToJpegResult.converted.length;

    this.cropMessage = '';

    var timeleft = 10;
    var downloadTimer = setInterval(() => {
      this.cropMessage = `Start cropping in ${timeleft} seconds...`;
      timeleft -= 1;
      if (timeleft <= 0) {
        this.tifToJpegResult.converted.forEach(converted => {
          console.log(`Cropping ${converted.real_file_name}`);
          let outputPath = this.imageService.autoCrop(
            converted.real_file_path,
            this.outputPath,
            converted.real_file_name,
          );
          this.outputResult.push(outputPath);
          console.log(`Finished cropping ${converted.real_file_name}`);
        });
      }
    }, 1000);

    this.cropMessage = '';

    this.step = 3;
  }

  convertedRealFilePath(converted: any) {
    return converted.filename.replace('%d', 0);
  }

  convertedRealFileName(converted: any) {
    return basename(converted.target) + '.jpeg';
  }
}
