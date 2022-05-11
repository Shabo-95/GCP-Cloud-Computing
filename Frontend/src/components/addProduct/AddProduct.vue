<template>
  <div>
    <router-link to="/admin" class="deco-none">
      <button class="btn btn-warning">zurück</button>
    </router-link>
    <div class="container-center">
      <form id="addProduct-form" v-on:submit.prevent="addProduct_firebase">
        <h3>Artikel hinzufügen</h3>
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
        <label for="productImage">Artikel Bild hochladen:</label><br />
        <input
          type="file"
          class="inputFields"
          id="productImage"
          name="productImage"
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
  name: "AddProduct",
  data() {
    const { token } = useSession();
    return {
      token,
      form: {
        productName: "",
        productPrice: "",
        productDescription: "",
      },
    };
  },
  methods: {
    async addProduct_firebase() {
      const cloudfunctions_produkts_API_URL =
        "https://europe-west3-webshop-316612.cloudfunctions.net/produkte/";
      var imageName = document.getElementById("productImage").value;
      await fetch(cloudfunctions_produkts_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: this.token,
        },
        body: JSON.stringify({
          produktName: this.form.productName,
          produktPreis: this.form.productPrice + " $",
          produktBeschreibung: this.form.productDescription,
          produktImage: imageName.split(/(\\|\/)/g).pop(),
        }),
      })
        .then(this.addProductImage_storage())
        .then(console.log("The Product is Successfully Created"))
        .catch((error) => console.log("Error", error));
      // Empty The Input Fields after Submit
      document.forms["addProduct-form"].reset();
    },
    async addProductImage_storage() {
      const cloudfunctions_imageService_API_URL =
        "https://europe-west3-webshop-316612.cloudfunctions.net/imageService/upload2";
      const imageName = document.getElementById("productImage");
      const formData = new FormData();
      formData.append("file", imageName.files[0]);
      await fetch(cloudfunctions_imageService_API_URL, {
        method: "POST",
        headers: { token: this.token },
        body: formData,
      })
        //.then((response) => console.log(response))
        .catch((error) => console.log(error));
    },
  },
};
</script>