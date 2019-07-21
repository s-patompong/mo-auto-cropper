import { Injectable } from '@angular/core';
import * as Datastore from 'nedb';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  private db;

  constructor(private electronService: ElectronService) {
    this.db = new Datastore({
      filename: electronService.pathOf('storage/setting.db'), autoload: true
    });
  }

  getDb() {
    return this.db;
  }
}
