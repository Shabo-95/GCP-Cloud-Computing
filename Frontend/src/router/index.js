import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import Login from "@/components/login/Login.vue";
import User from "@/components/user/User.vue";
import Overview from "@/components/overview/Overview.vue";
import SignUp from "@/components/signUp/SignUp.vue";
import ShoppingCart from "../components/shoppingCart/ShoppingCart";
import Admin from "@/components/admin/Admin.vue";
import AddProduct from "@/components/addProduct/AddProduct.vue";
import EditProduct from "@/components/editProduct/EditProduct.vue";
import ShowAllProducts from "@/components/showAllProducts/ShowAllProducts.vue";
import ShowAllUsers from "@/components/showAllUsers/ShowAllUsers.vue";
import ShowAllOrders from "@/components/showAllOrders/ShowAllOrders.vue";
import AddOrder from "@/components/addOrder/AddOrder.vue";
import { Path } from "../constants/Path";
import GoogleMap from "../components/googleMap/GoogleMap";
import MakeAdmin from "@/components/makeAdmin/MakeAdmin.vue";
import UserOrders from "@/components/userOrders/UserOrders.vue";
import useSession from "@/service/SessionStore";
import logoutService from "@/service/LogoutService";

// import { useRouter, useRoute } from "vue-router";
import firebase from "firebase";

const routes = [
  {
    path: Path.HOME,
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: Path.LOGIN,
    name: "Login",
    component: Login,
    meta: { loggedIn: true },
  },
  {
    path: Path.OVERVIEW,
    name: "Overview",
    component: Overview,
  },
  {
    path: Path.USER,
    name: "User",
    component: User,
    meta: { requiresAuth: true },
  },
  {
    path: Path.SIGNUP,
    name: "SignUp",
    component: SignUp,
    meta: { loggedIn: true },
  },
  {
    path: Path.SHOPPINGCART,
    name: "ShoppingCart",
    component: ShoppingCart,
  },
  {
    path: Path.ADMIN,
    name: "Admin",
    component: Admin,
    meta: { requiresAdmin: true },
  },
  {
    path: Path.ADDPRODUCT,
    name: "AddProduct",
    component: AddProduct,
    meta: { requiresAdmin: true },
  },
  {
    path: Path.EDITPRODUCT,
    name: "EditProduct",
    component: EditProduct,
    meta: { requiresAdmin: true },
  },
  {
    path: Path.SHOWALLPRODUCTS,
    name: "ShowAllProducts",
    component: ShowAllProducts,
    meta: { requiresAdmin: true },
  },
  {
    path: Path.SHOWALLUSERS,
    name: "ShowAllUsers",
    component: ShowAllUsers,
    meta: { requiresAdmin: true },
  },
  {
    path: Path.SHOWALLORDERS,
    name: "ShowAllOrders",
    component: ShowAllOrders,
    meta: { requiresAdmin: true },
  },
  {
    path: Path.MAKEADMIN,
    name: "MakeAdmin",
    component: MakeAdmin,
    meta: { requiresAdmin: true },
  },
  {
    path: Path.GOOGLEMAP,
    name: "GoogleMap",
    component: GoogleMap,
  },
  {
    path: Path.ADDORDER,
    name: "AddOrder",
    component: AddOrder,
  },
  {
    path: Path.USERORDERS,
    name: "UserOrders",
    component: UserOrders,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // logout wenn the page is reloaded
  window.addEventListener("unload", function() {
    console.log("Page Reloaded !!!!!");
    logoutService.logout();
  });

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;
  const loggedIn = to.matched.some((record) => record.meta.loggedIn);

  const { role, email } = useSession();
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !isAuthenticated) {
    next("/login");
    /* if the User already Loggedin */
  } else if (loggedIn && isAuthenticated && email.value != "") {
    next("/overview");
  } else if (requiresAdmin && role.value != "ADMIN") {
    next("/overview");
  } else {
    next();
  }
});

export default router;
