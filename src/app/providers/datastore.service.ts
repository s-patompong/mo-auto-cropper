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
      filename: this.dbPath(), autoload: true
    });

    console.log('DB Path: ' + this.dbPath());
  }

  getDb() {
    return this.db;
  }

  dbPath() {
    return this.electronService.pathOf('storage/setting.db');
  }
}
