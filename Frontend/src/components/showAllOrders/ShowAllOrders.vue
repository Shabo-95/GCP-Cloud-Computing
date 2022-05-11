<template>
  <div>
    <router-link to="/" class="deco-none">
      <button>zurück</button>
    </router-link>
    <h1>Alle Bestellungen</h1>
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>Email</th>
          <th>BestellNr</th>
          <th>Gesamtpreis</th>
          <th>Produkt</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-for="order in orders" v-bind:key="order.email">
        <tr>
          <td></td>
          <td>{{ order.email }}</td>
          <td>{{ order.bestellNr }}</td>
          <td>{{ order.gesamt + " $" }}</td>
          <td>{{ order.produkt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { onBeforeMount, reactive } from "vue";
import useSession from "@/service/SessionStore";

export default {
  name: "Orders",
  setup() {
    let orders = reactive([]);
    const { token } = useSession();

    onBeforeMount(() => {
      fetchOrders();
    });
    async function fetchOrders() {
      console.log(token.value);
      await fetch(
        "https://europe-west3-webshop-316612.cloudfunctions.net/bestellungen/",
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
          orders.push(...data);
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    return { orders };
  },
};
</script>
