import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDombm0tc4fRWr4ur-K4QPs0LGhi0NTPUQ",
  authDomain: "webshop-316612.firebaseapp.com",
  projectId: "webshop-316612",
  storageBucket: "webshop-316612.appspot.com",
  messagingSenderId: "977876332823",
  appId: "1:977876332823:web:d762dcc8d36fc57b280752",
  measurementId: "G-F78VMV0EP7",
};

firebase.initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router);
app
  .use(VueGoogleMaps, {
    load: {
      key: "AIzaSyCuJ50z6hM8vQf2Lvi29exY7S8nlqgLs4E",
    },
  })
  .mount("#app");
