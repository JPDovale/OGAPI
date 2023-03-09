import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

import { env } from '@env/index'

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID,
  measurementId: env.MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
