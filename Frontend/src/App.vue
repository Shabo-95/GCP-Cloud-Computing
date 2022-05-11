<template>
  <div id="app">
    <header>
      <Navbar />
    </header>
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/navbar/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  // Set Overview as HomePage
  mounted() {
    let root = "/overview";
    this.$router.push({ path: root });
  },
};
</script>

<style>
html {
  margin-top: 60px;
}
</style>
