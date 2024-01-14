import { Module } from '@nestjs/common';
import { FcmService } from '../services/fcm.service';
import { ConfigService } from '@nestjs/config';
import { IFirebaseAdminConfigs } from '../configs/firebase.types';
import * as firebase from 'firebase-admin';

@Module({
  providers: [FcmService],
  exports: [FcmService],
})
export class FirebaseModule {
  constructor(private readonly configService: ConfigService) {
    const configs = {
      type: configService.get('type') as string,
      project_id: configService.get('project_id') as string,
      private_key_id: configService.get('private_key_id') as string,
      private_key: configService.get('private_key') as string,
      client_email: configService.get('client_email') as string,
      client_id: configService.get('client_id') as string,
      auth_uri: configService.get('auth_uri') as string,
      token_uri: configService.get('token_uri') as string,
      auth_provider_x509_cert_url: configService.get(
        'auth_provider_x509_cert_url',
      ) as string,
      client_x509_cert_url: configService.get('client_x509_cert_url') as string,
    } as IFirebaseAdminConfigs;

    firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: configs.project_id,
        clientEmail: configs.client_email,
        privateKey: configs.private_key,
      }),
    });
  }
}
