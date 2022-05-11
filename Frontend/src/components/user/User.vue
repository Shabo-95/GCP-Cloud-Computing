<template>
  <div class="user">
    <div class="container-center">
      <form @submit.prevent="handleSubmit">
        <h3>Profil</h3>
        <div class="form-group-signup" style="display: table">
          <div style="display: table-cell">
            <label for="input-firstname">Vorname</label>
            <input
              type="text"
              class="form-control"
              id="input-firstname"
              placeholder="Max"
              size="30"
              disabled="true"
            />
          </div>
          <div style="display: table-cell">
            <label for="input-lastname">Nachname</label>
            <input
              type="text"
              class="form-control"
              id="input-lastname"
              placeholder="Mustermann"
              size="30"
              disabled="true"
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
              disabled="true"
            />
          </div>
          <div style="display: table-cell">
            <label for="input-plz">PLZ</label>
            <input
              type="number"
              class="form-control"
              id="input-plz"
              placeholder="12345"
              disabled="true"
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
              disabled="true"
            />
          </div>
          <div style="display: table-cell">
            <label for="input-number">Telefonnnummer</label>
            <input
              type="number"
              class="form-control"
              id="input-number"
              placeholder="0173987987"
              disabled="true"
            />
          </div>
        </div>
        <div class="bottom-buttons-container">
          <button class="btn btn-primary" @click="profilBearbeiten">
            Profil bearbeiten
          </button>
          <button class="btn btn-success" @click="speichern">
            Speichern
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, reactive } from "vue";
import useSession from "@/service/SessionStore";

export default {
  name: "User",
  setup() {
    let nutzer = reactive([]);
    const { token, email } = useSession();

    onBeforeMount(() => {
      fetchUser();
    });
    async function fetchUser() {
      console.log("token is: ", token.value);
      console.log("email is: ", email.value);
      await fetch(
        "https://europe-west3-webshop-316612.cloudfunctions.net/nutzerinfo/" +
          email.value,
        {
          method: "GET",
          headers: { token: token.value },
        }
      )
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log("data:", data);
          nutzer.push(...data);
          input_fill_userData(nutzer);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    function input_fill_userData(nutzer) {
      for (var data in nutzer) {
        document.getElementById("input-firstname").value = nutzer[data].vorname;
        document.getElementById("input-lastname").value = nutzer[data].nachname;
        const words = nutzer[data].adresse.split(" ");
        document.getElementById("input-street").value =
          words[0] + " " + words[1];
        document.getElementById("input-plz").value = words[2];
        document.getElementById("input-city").value = words[3];
        document.getElementById("input-number").value =
          nutzer[data].telefonnummer;
      }
    }
    function profilBearbeiten() {
      let input = document.querySelectorAll(".form-control");
      input.forEach((element) => {
        element.disabled = false;
      });
    }
    async function speichern() {
      let input = document.querySelectorAll(".form-control");
      input.forEach((element) => {
        element.disabled = true;
      });
      console.log("token is: ", token.value);
      console.log("email is: ", email.value);
      await fetch(
        "https://europe-west3-webshop-316612.cloudfunctions.net/nutzerinfo/edit/" +
          email.value,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token.value,
          },
          body: JSON.stringify({
            email: email.value,
            nachname: document.getElementById("input-lastname").value,
            vorname: document.getElementById("input-firstname").value,
            telefonnummer: document.getElementById("input-number").value,
            adresse:
              document.getElementById("input-street").value +
              " " +
              document.getElementById("input-plz").value +
              " " +
              document.getElementById("input-city").value,
          }),
        }
      )
        .then(console.log("The User is Successfully Updated"))
        .catch((error) => console.log("Error", error));
    }
    return { nutzer, token, email, profilBearbeiten, speichern };
  },
};
</script>
