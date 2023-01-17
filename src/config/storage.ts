import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCpgCN4N0hgQudkLMhfzyvbag3iDp1BieA',
  authDomain: 'ognaretests.firebaseapp.com',
  projectId: 'ognaretests',
  storageBucket: 'ognaretests.appspot.com',
  messagingSenderId: '783227330128',
  appId: '1:783227330128:web:2d92f57e004d8c03ce3b55',
  measurementId: 'G-Y84CZ0MYH1',
}

export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
