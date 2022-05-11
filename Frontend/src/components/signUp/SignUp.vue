<template>
  <div class="signup">
    <div class="container-center">
      <form @submit.prevent="handleSubmit">
        <h3>SignUp</h3>
        <div class="form-group-signup" style="display: table">
          <div style="display: table-cell">
            <label for="input-vorname">Vorname</label>
            <input
              type="text"
              class="form-control"
              id="input-vorname"
              placeholder="Max"
              size="30"
              v-model="signUpData.vorname"
            />
          </div>
          <div style="display: table-cell">
            <label for="input-nachname">Nachname</label>
            <input
              type="text"
              class="form-control"
              id="input-nachname"
              placeholder="Mustermann"
              size="30"
              v-model="signUpData.nachname"
            />
          </div>
        </div>
        <div class="form-group-signup" style="display: table">
          <div style="display: table-cell">
            <label for="input-street">Straße und Hausnummer</label>
            <input
              type="text"
              class="form-control"
              id="input-street"
              placeholder="Muster Street"
              size="40"
              v-model="signUpData.street"
            />
          </div>
          <div style="display: table-cell">
            <label for="input-plz">PLZ</label>
            <input
              type="number"
              class="form-control"
              id="input-plz"
              placeholder="12345"
              v-model="signUpData.plz"
            />
          </div>
        </div>
        <div class="form-group-signup" style="display: table">
          <div style="display: table-cell">
            <label for="input-city">Stadt</label>
            <input
              type="text"
              class="form-control"
              id="input-city"
              placeholder="Wien"
              size="40"
              v-model="signUpData.city"
            />
          </div>
          <div style="display: table-cell">
            <label for="input-number">Telefonnnummer</label>
            <input
              type="number"
              class="form-control"
              id="input-number"
              placeholder="0173987987"
              v-model="signUpData.number"
            />
          </div>
        </div>
        <div class="form-group-signup" style="display: table">
          <div style="display: table-cell">
            <label for="input-email">Email</label>
            <input
              type="email"
              class="form-control"
              id="input-email"
              size="30"
              placeholder="123@test.de"
              v-model="signUpData.email"
            />
          </div>
          <div style="display: table-cell">
            <label for="input-password">Passwort</label>
            <input
              type="password"
              class="form-control"
              id="input-password"
              placeholder="***"
              size="30"
              v-model="signUpData.password"
            />
          </div>
        </div>
        <div class="bottom-buttons-container">
          <button class="btn btn-primary" @click="signUp">Register</button>
          <button class="btn btn-secondary" @click="login">To Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { Path } from "@/constants/Path";
import axios from "axios";
import router from "@/router/index";
import { Endpoint } from "@/constants/Endpoint";
import firebase from "firebase";
import useSession from "@/service/SessionStore";

//TODO: Validation and Login

export default {
  setup() {
    const { setEmail, setId, setToken, email } = useSession();
    const signUpData = reactive({
      email: "",
      password: "",
      nachname: "",
      vorname: "",
      street: "",
      number: "",
      plz: "",
      city: "",
    });

    const adress = computed(
      () => signUpData.street + " " + signUpData.plz + " " + signUpData.city
    );

    async function send() {
      await axios
        .post(Endpoint.SIGNUP + "/submit", {
          email: signUpData.email,
          nachname: signUpData.nachname,
          vorname: signUpData.vorname,
          telefonnummer: signUpData.number,
          adresse: adress.value,
        })
        //Handle responses
        .then((response) => {
          const status = response.status;
          if (status == 201) {
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                signUpData.email,
                signUpData.password
              )
              .then((cred) => {
                console.log(cred);
                setEmail(cred.user.email);
                console.log("cred.user.email: ", cred.user.email);
                console.log("cred.user.id: ", cred.user.uid);
                setId(cred.user.uid);
                return cred.user.getIdToken();
              })
              .then((idToken) => {
                setToken(idToken);
                console.log("USER CREATED: " + email.value);
                console.log("idToken: " + idToken);
                router.push(Path.HOME);
              });
          }
        })
        .catch((error) => {
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            throw new Error(error);
          } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            window.alert(error.request);
            throw new Error(error.request);
          } else {
            // Something happened in setting up the request and triggered an Error
            window.alert(error.message);
            throw new Error(error.message);
          }
        });
    }

    function signUp() {
      send();
    }

    function login() {
      router.push(Path.LOGIN);
    }

    return {
      signUpData,
      signUp,
      login,
    };
  },
};
</script>

<style>
.form-group-signup {
  margin-top: 2%;
  margin-bottom: 2%;
}
</style>
