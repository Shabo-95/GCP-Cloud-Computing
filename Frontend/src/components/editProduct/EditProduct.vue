<template>
  <div>
    <router-link to="/showAllProducts" class="deco-none">
      <button class="btn btn-warning">zurück</button>
    </router-link>
    <div class="container-center">
      <form
        id="editProduct-form"
        v-on:submit.prevent="editProduct($route.params.id)"
      >
        <h3>Artikel bearbeiten</h3>
        <label for="productName">Artikel Name:</label><br />
        <input
          type="text"
          class="inputFields"
          id="productName"
          name="productName"
          v-model="form.productName"
          required
        /><br /><br />
        <label for="productPrice">Artikel Preis:</label><br />

        <input
          type="text"
          class="inputFields"
          id="productPrice"
          name="productPrice"
          v-model="form.productPrice"
          required
        /><br /><br />
        <label for="productDescription">Artikel Beschreibung:</label><br />

        <input
          type="text"
          class="inputFields"
          id="productDescription"
          name="productDescription"
          v-model="form.productDescription"
          required
        /><br /><br />
        <input type="submit" class="btn btn-success" value="hinzufügen" />
      </form>
    </div>
  </div>
</template>
<script>
import useSession from "@/service/SessionStore";
export default {
  name: "EditProduct",
  data() {
    const { token } = useSession();
    return {
      token,
      imageChangedBoolean: false,
      form: {
        productName: this.$route.params.name,
        productPrice: this.$route.params.price,
        productDescription: this.$route.params.description,
      },
    };
  },
  methods: {
    async editProduct(ID) {
      const cloudfunctions_produkts_API_URL =
        "https://europe-west3-webshop-316612.cloudfunctions.net/produkte/";
      //var imageName = document.getElementById("productImage").value;
      console.log("Token is: " + this.token);
      await fetch(cloudfunctions_produkts_API_URL + ID, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: this.token,
        },
        body: JSON.stringify({
          produktName: this.form.productName,
          produktPreis: this.form.productPrice,
          produktBeschreibung: this.form.productDescription,
          produktImage: this.$route.params.image,
        }),
      })
        //then((res) => console.log(res))
        .then(console.log("The Product is Successfully Updated"))
        .catch((error) => console.log("Error", error));
      // Redirect the Page automatically to "ShowAllProducts" Page
      this.$router.push({ name: "ShowAllProducts" });
    },
  },
  created() {
    console.log("Produkt-ID = " + this.$route.params.id);
  },
};
</script>
