<!-- <template>
  <GoogleLogin :callback="callback" :client-id="clientId" prompt />
</template>

<script lang="ts" setup>
import { CallbackTypes, GoogleLogin } from 'vue3-google-login';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const callback: CallbackTypes.CredentialCallback = (response) => {
  response.credential
}
</script>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8aAc0NQoELFCT06DUkFRf96zH_Tp6834",
  authDomain: "iss-scooter-data-collection.firebaseapp.com",
  projectId: "iss-scooter-data-collection",
  storageBucket: "iss-scooter-data-collection.appspot.com",
  messagingSenderId: "846889115446",
  appId: "1:846889115446:web:5c6293497563193cd39d97",
  measurementId: "G-9KXL28GDL7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

 -->
