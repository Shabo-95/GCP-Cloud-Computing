<template>
  <div class="login">
    <h1>Overview</h1>
    <div class="container">
      <div class="row">
        <div
          class="col-sm-4"
          v-for="product in products"
          v-bind:key="product.id"
        >
          <div class="card" style="width: 18rem;">
            <img
              class="card-img-top"
              :src="product.produktImageURL"
              alt="no picture available"
              height="240"
              width="180"
            />
            <div class="card-body text-center">
              <h5 class="card-title text-center">{{ product.produktName }}</h5>
              <p class="card-text text-center">{{ product.produktPreis }}</p>
              <a @click="addToCart(product)" class="btn btn-primary"
                >Warenkorb legen</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { onBeforeMount, reactive } from "vue";

export default {
  name: "Overview",
  setup() {
    let products = reactive([]);
    let cart = reactive([]);

    onBeforeMount(() => {
      fetchProducts().then(function() {
        fetchProductsURL().then(function() {
          readLocalStorageCart().then(function() {});
        });
      });
    });

    async function fetchProducts() {
      await axios
        .get("https://europe-west3-webshop-316612.cloudfunctions.net/produkte")
        .then(function(response) {
          products.push(...response.data);
          console.log(products);
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    async function fetchProductsURL() {
      products.forEach((product) => {
        axios
          .get(
            "https://europe-west3-webshop-316612.cloudfunctions.net/imageService/getURL?product=" +
              product.produktImage
          )
          .then(function(response) {
            product.produktImageURL = response.data;
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    }

    async function readLocalStorageCart() {
      cart.forEach(function() {
        cart.pop();
      });
      if (localStorage["cart"] != null) {
        var data = JSON.parse(localStorage["cart"]);
        data.forEach(function(item) {
          if (item != null) {
            cart.push(item);
          }
        });
      }
    }

    function addToCart(product) {
      cart.push(product);
      localStorage["cart"] = JSON.stringify(cart);
    }

    return {
      addToCart,
      products,
      cart,
    };
  },
};
</script>

<style>
.card {
  border-style: outset;
  border-radius: 25px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-top: 5%;
  margin-bottom: 5%;
}
.card:hover {
  transform: scale(1.1);
}
</style>
