<template>
  <div class="container-center container-admin">
    <h1>Willkommen Admin</h1>
    <router-link to="/addProduct" class="deco-none">
      <button class="btn btn-primary admin-buttons">
        Artikel hinzufügen
      </button>
    </router-link>

    <router-link to="/showAllProducts" class="deco-none">
      <button class="btn btn-primary admin-buttons">
        Alle Artikeln anzeigen
      </button>
    </router-link>

    <router-link to="/showAllUsers" class="deco-none">
      <button class="btn btn-primary admin-buttons">
        Alle Users anzeigen
      </button>
    </router-link>

    <router-link to="/showAllOrders" class="deco-none">
      <button class="btn btn-primary admin-buttons">
        Alle Bestellungen anzeigen
      </button>
    </router-link>
  </div>
</template>

<style>
.container-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  border-style: outset;
  border-radius: 25px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 2%;
}
#productImage {
  width: 70%;
}
label {
  padding-bottom: 1%;
}
.admin-buttons {
  margin: 1%;
}
</style>
