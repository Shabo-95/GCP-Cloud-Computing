<template>
  <div class="makeAdmin">
    <div class="container-center">
      <input type="email" v-model="adminemail" placeholder="admin@webshop.de" />
      <button @click="send" class="btn btn-primary">Make Admin</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { ref } from "vue";

export default {
  setup() {
    const adminemail = ref("");

    async function send() {
      const addAdmin = firebase.functions().httpsCallable("addAdmin");
      addAdmin({ email: adminemail.value }).then((result) => {
        console.log(result);
      });
    }

    return { send, adminemail };
  },
};
</script>
