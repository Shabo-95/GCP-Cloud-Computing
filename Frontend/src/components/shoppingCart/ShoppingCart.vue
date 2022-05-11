<template>
  <div class="warenkorb">
    <!--Section: Block Content-->
    <section>
      <!--Grid row-->
      <div class="row">
        <!--Grid column-->
        <div class="col-lg-8">
          <!-- Card -->
          <div class="mb-3">
            <div class="pt-4 wish-list">
              <h5 class="mb-4">Warenkorb</h5>
              <div class="row mb-4" v-for="c in cart" v-bind:key="c.id">
                <div class="col-md-5 col-lg-3 col-xl-3">
                  <div class="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">
                    <img
                      class="card-img-top"
                      :src="c.produktImageURL"
                      alt="Sample"
                      height="240"
                      width="auto"
                    />
                  </div>
                </div>
                <div class="col-md-7 col-lg-9 col-xl-9">
                  <div>
                    <div class="d-flex justify-content-between">
                      <div>
                        <h5>{{ c.produktName }}</h5>
                      </div>
                    </div>
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <p class="mb-0">
                        <span
                          ><strong id="summary"
                            >Preis: {{ c.produktPreis }}</strong
                          ></span
                        >
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--Grid column-->
        <div class="col-lg-4">
          <div class="mb-3">
            <div class="pt-4">
              <h5 class="mb-3">Rechnung</h5>
              <ul class="list-group list-group-flush">
                <li
                  class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0"
                >
                  Preis ohne Mehrwertsteuer
                  <span>{{ sum }} Euro</span>
                </li>
                <li
                  class="list-group-item d-flex justify-content-between align-items-center px-0"
                >
                  Shipping
                  <span>Gratis</span>
                </li>
                <li
                  class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3"
                >
                  <div>
                    <strong>Preis insgesamt</strong>
                    <strong>
                      <p class="mb-0">(inkl. Mehrwertsteuer von 19%)</p>
                    </strong>
                  </div>
                  <span
                    ><strong>{{ sumWithTax }} Euro</strong></span
                  >
                </li>
              </ul>
              <a
                @click="bestellungAbgesendet(nutzer, index)"
                class="btn btn-primary"
              >
                Jetzt Kaufen
              </a>
              <a
                @click="warenkorbLeeren"
                class="btn btn-danger"
                style="margin-left:5%"
              >
                Warenkorb leeren
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import useSession from "@/service/SessionStore";
// import axios from "axios";
import { Path } from "@/constants/Path";
import router from "@/router/index";

export default {
  name: "ShoppingCart",
  setup() {
    let cart = reactive([]);
    let sum = ref(0);
    let sumWithTax = ref(0);
    let uniqID = ref(0);
    let produktNames = ref("");
    const { email, uid, token } = useSession();

    onMounted(() => {
      readLocalStorageCart()
        .then(function() {
          calcCartSum()
            .then(getUniqID())
            .then(function() {
              console.log("calculating sum...");
              console.log("sum is: " + sum.value);
            });
        })
        .then(addProductNames())
        .catch(function(err) {
          console.log(err);
        });
    });

    async function readLocalStorageCart() {
      //localStorage.removeItem("cart");
      if (localStorage["cart"] != null) {
        cart.push(...JSON.parse(localStorage["cart"]));
      } else {
        console.log(localStorage["cart"]);
      }
    }

    async function calcCartSum() {
      cart.forEach(function(item) {
        sum.value += parseFloat(item.produktPreis);
      });
      sumWithTax.value = 1.19 * sum.value;
    }

    async function getUniqID() {
      uniqID = Math.round(+new Date() / 1000);
    }

    async function addProductNames() {
      cart.forEach(function(item) {
        produktNames.value += item.produktName + ", ";
        console.log(item.produktName);
      });
    }

    function warenkorbLeeren() {
      localStorage.removeItem("cart");
      cart.splice(0);
      console.log(cart);
    }

    async function bestellungAbgesendet() {
      if (localStorage["cart"] != null) {
        if (uid.value != "") {
          cart.push(...JSON.parse(localStorage["cart"]));
          console.log(token.value);
          console.log(uid.value);
          await fetch(
            "https://europe-west3-webshop-316612.cloudfunctions.net/bestellungen",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token.value,
                uid: uid.value,
              },
              body: JSON.stringify({
                email: email.value,
                bestellNr: uniqID,
                gesamt: sumWithTax.value,
                produkt: produktNames.value,
              }),
            }
          )
            .then(console.log("The Product is Successfully Created"))
            .then(router.push(Path.ADDORDER));
          //.catch((error) => console.log("Error", error));
        } else {
          alert(
            "Sie müssen sich bei uns registrieren um ein Artikel zu kaufen !!"
          );
        }
      } else {
        alert("Ihren Warenkorb ist leer !!");
      }
    }

    return {
      cart,
      sum,
      sumWithTax,
      warenkorbLeeren,
      addProductNames,
      bestellungAbgesendet,
    };
  },
};
</script>
