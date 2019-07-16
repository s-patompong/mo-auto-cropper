import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileExtensionService {

  constructor() { }

  dotTif() {
    return '.tif';
  }
}
