<template>
  <div class="Home">
    <h1>Home</h1>
    <h2>Willkommen {{ templ.r }}</h2>
    <h3>Email: {{ templ.e }}</h3>
  </div>
</template>

<script>
import useSession from "@/service/SessionStore";
import { reactive } from "vue";

export default {
  name: "Home",
  setup() {
    const { role, email } = useSession();

    const templ = reactive({
      r: role.value,
      e: email.value,
    });
    return { templ };
  },
};
</script>
