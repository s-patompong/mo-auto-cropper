import { Injectable } from '@angular/core';
import { DatastoreService } from './datastore.service';

@Injectable({
  providedIn: 'root'
})
export class ImagemagickPathService {

  private name = 'image-magick-path';

  constructor(private datastoreService: DatastoreService) {
  }

  exists(callback: any) {
    this.db.find({ name: this.name }, (err, docs) => {
      callback(docs.length !== 0);
    });
  }

  get db() {
    return this.datastoreService.getDb();
  }

  update(path: string, callback: any) {
    this.exists((exists) => {
      if (exists) {
        this.db.update(
          { name: this.name },
          { $set: { value: path } },
          { multi: true },
          function (err, numReplaced) {
            callback(err !== null);
          });
      } else {
        this.db.insert({
          name: this.name,
          value: path,
        }, function (err, newDoc) {
          callback(err !== null);
        });
      }
    });
  }

  get(callback: any) {
    this.db.find({ name: this.name }, function (err, docs) {
      callback(docs[0].value);
    });
  }
}
