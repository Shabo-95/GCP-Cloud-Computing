import { computed, reactive } from "vue";
//import firebase from "firebase";

const empty = "";

const state = reactive({
  token: empty, //session token
  role: "CUSTOMER", //role admin or customer
  email: empty, //email of active user
  uid: empty, //authorization header
});

function setRole(role) {
  state.role = role;
}

function setEmail(inputEmail) {
  state.email = inputEmail;
}

function setToken(inputToken) {
  state.token = inputToken;
}

function setId(inputId) {
  console.log("inputId: ", inputId);
  state.uid = inputId;
}

function resetSession() {
  state.token = empty;
  state.role = "CUSTOMER";
  state.email = empty;
  state.uid = empty;
}

export default function useSession() {
  return {
    role: computed(() => state.role),
    email: computed(() => state.email),
    header: computed(() => state.header),
    uid: computed(() => state.uid),
    token: computed(() => state.token),
    resetSession,
    setId,
    setEmail,
    setToken,
    setRole,
  };
}
