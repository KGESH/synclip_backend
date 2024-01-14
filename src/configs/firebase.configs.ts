import * as path from 'path';
import * as fs from 'fs';

const configFilePath = path.join(__dirname, '..', '..', 'firebase_cred.json');

export function readFirebaseAdminConfigs() {
  try {
    const file = fs.readFileSync(configFilePath, 'utf-8');
    const configs = JSON.parse(file);
    console.log('Firebase Admin Configs: ', configs);
    return configs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
