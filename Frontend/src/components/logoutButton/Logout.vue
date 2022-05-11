<template>
  <!-- v-if="uid != empty" -->
  <a class="nav-link logout-nav-link" @click="handleClick" v-if="uid">
    Logout
  </a>
</template>

<script>
import firebase from "firebase";
import useSession from "@/service/SessionStore";
import { Path } from "@/constants/Path";
import router from "@/router/index";

export default {
  name: "LogoutButton",
  setup() {
    const { uid, resetSession } = useSession();
    const empty = "";

    function logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("logged out");
          resetSession();
          router.push(Path.LOGIN);
        });
    }

    function handleClick() {
      console.log("uid:" + uid.value);
      logout();
      console.log("uid:" + uid.value);
    }

    return { uid, handleClick, empty };
  },
};
</script>
<style>
.logout-nav-link:hover {
  cursor: pointer;
}
</style>
