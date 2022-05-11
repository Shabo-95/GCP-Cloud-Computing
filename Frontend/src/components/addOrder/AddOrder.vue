<template>
  <div>
    <router-link to="/" class="deco-none">
      <button>zurück</button>
    </router-link>
    <div class="container-center">
      <h1 class="add-order" style="color:green">Bestellung abgeschlossen</h1>
      <h2 class="add-order" style="color:blue">
        Vielen Dank für Ihren Einkauf
      </h2>
      <h3 class="add-order" style="color:blue">
        Ihre Bestellung ist an uns gesendet
      </h3>
    </div>
  </div>
</template>
<script>
import { onBeforeMount, reactive } from "vue";

export default {
  name: "AddOrder",
  setup() {
    let cart = reactive([]);
    onBeforeMount(() => {
      readLocalStorageCart();
      console.log(cart);
      /*fetchUsers();*/
      emptyCart();
    });
    /*function fetchUsers() {
        //TODO
    }*/
    async function readLocalStorageCart() {
      cart.push(...JSON.parse(localStorage["cart"]));
    }

    async function emptyCart() {
      localStorage.removeItem("cart");
    }
    return {
      readLocalStorageCart,
    };
  },
};
</script>
<style>
.add-order {
  margin-top: 5%;
  margin-bottom: 5%;
}
</style>
