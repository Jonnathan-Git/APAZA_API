import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

@Injectable()
export class FirebaseService {
  public storage: firebase.storage.Storage;

  constructor(private configService: ConfigService) {
    const FBApp = firebase.initializeApp({
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      appId: this.configService.get<string>('FIREBASE_APP_ID'),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      locationId: this.configService.get<string>('FIREBASE_LOCATION_ID'),
      apiKey: this.configService.get<string>('FIREBASE_API_KEY'),
      authDomain: this.configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      messagingSenderId: this.configService.get<string>('FIREBASE_MESSAGING_SENDER_ID'),
      measurementId: this.configService.get<string>('FIREBASE_MEASUREMENT_ID'),
    });

    this.storage = FBApp.storage();
  }

  public getStorageRef() {
    return this.storage.ref();
  }
}
