import { Injectable } from '@angular/core';
import { rootPath } from 'electron-root-path';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfig } from '../../environments/environment';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  getAppRoot() {
    if ( process.platform === 'win32' ) {
      return path.join( this.remote.app.getAppPath(), '/../../../' );
    }  else {
      if(!AppConfig.production) {
        return this.remote.app.getAppPath();  
      }
      
      return path.dirname(this.remote.app.getAppPath());
    }
  }

  pathOf(pathToJoin: string) {
    return path.join(rootPath, pathToJoin);
  }

}
