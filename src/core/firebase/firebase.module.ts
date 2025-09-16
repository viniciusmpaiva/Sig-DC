// src/core/firebase/firebase.module.ts

import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Assumes you use ConfigModule for env variables

// This is a custom provider token we'll use to inject Firestore
export const FIRESTORE_PROVIDER = 'FIRESTORE_PROVIDER';

@Module({
  imports: [ConfigModule], // Import ConfigModule to use environment variables
  providers: [
    {
      provide: FIRESTORE_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Check if the app is already initialized to prevent errors
        if (admin.apps.length === 0) {
          const privateKey = configService.get<string>('FIREBASE_PRIVATE_KEY');

          console.log('FIREBASE_PRIVATE_KEY:', privateKey ? 'Loaded' : 'Not Loaded');
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
              clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
              privateKey: privateKey ? privateKey.replace(/\n/g, '\n') : undefined,
            }),
          });
        }
        
        // Return the Firestore instance
        return admin.firestore();
      },
    },
  ],
  exports: [FIRESTORE_PROVIDER], // Export the provider to make it available in other modules
})
export class FirebaseModule {}