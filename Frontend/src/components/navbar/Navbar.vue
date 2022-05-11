<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <!-- <img src="@/assets/logo.svg" class="logo" alt="Logo"/> -->
    <button
      class="navbar-toggler"
      data-toggle="collapse"
      data-target="#navbarMenu"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarMenu">
      <ul class="navbar-nav" id="navbar-ul">
        <li class="nav-item">
          <router-link to="/">
            <a class="nav-link">Home</a>
            <!-- <img src="@/assets/logo.svg" class="logo" alt="Logo"/> -->
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/overview" class="deco-none">
            <a class="nav-link">Artikelübersicht</a>
          </router-link>
        </li>
        <li class="nav-item" v-if="uid">
          <router-link to="/user" class="deco-none">
            <a class="nav-link">Konto</a>
          </router-link>
        </li>

        <li>
          <router-link
            to="/shoppingcart"
            class="deco-none"
            v-if="role != 'ADMIN'"
          >
            <a class="nav-link">Warenkorb</a>
          </router-link>
        </li>

        <li>
          <router-link to="/standort" class="deco-none">
            <a class="nav-link">Standort</a>
          </router-link>
        </li>

        <li>
          <router-link to="/admin" class="deco-none" v-if="role == 'ADMIN'">
            <a class="nav-link">Admin</a>
          </router-link>
        </li>

        <li>
          <router-link to="/makeadmin" class="deco-none" v-if="role == 'ADMIN'">
            <a class="nav-link">Add an Admin</a>
          </router-link>
        </li>

        <li>
          <router-link
            to="/userOrders"
            class="deco-none"
            v-if="role == 'CUSTOMER' && uid"
          >
            <a class="nav-link">Meine Bestellungen</a>
          </router-link>
        </li>

        <li>
          <router-link to="/login" class="deco-none" v-if="!uid">
            <a class="nav-link">Login</a>
          </router-link>
        </li>

        <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import useSession from "@/service/SessionStore";
import LogoutButton from "@/components/logoutButton/Logout.vue";

export default {
  name: "Navbar",
  data() {
    const { role, uid } = useSession();
    // console.log("role !!!!!", role);
    return {
      role: role,
      uid: uid,
    };
  },
  components: {
    LogoutButton,
  },
  methods: {
    func() {
      console.log("this.role: ", this.role);
      console.log("this.uid: ", this.uid);
    },
  },
};
</script>

<style></style>
