import firebase from "firebase";
import useSession from "@/service/SessionStore";
import { Path } from "@/constants/Path";
import router from "@/router/index";

const { resetSession } = useSession();

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

export default function logoutService() {
  return {
    logout,
  };
}
