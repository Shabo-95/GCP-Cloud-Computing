<template>
  <div>
    <router-link to="/" class="deco-none">
      <button>zurück</button>
    </router-link>
    <h1>Bestellungen</h1>
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>BestellNr.</th>
          <th>Produkte</th>
          <th>Gesamt Preis</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-for="bestellung in bestellungen" v-bind:key="bestellung.email">
        <tr>
          <td></td>
          <td>{{ bestellung.bestellNr }}</td>
          <td>{{ bestellung.produkt }}</td>
          <td>{{ bestellung.gesamt + " $" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { onBeforeMount, reactive } from "vue";
import useSession from "@/service/SessionStore";

export default {
  name: "UserOrders",
  setup() {
    const { token, email } = useSession();
    let bestellungen = reactive([]);
    onBeforeMount(() => {
      fetchUsers();
    });

    async function fetchUsers() {
      console.log(token.value);
      await fetch(
        "https://europe-west3-webshop-316612.cloudfunctions.net/bestellungen/" +
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
          console.log(data);
          bestellungen.push(...data);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    return { bestellungen };
  },
};
</script>
