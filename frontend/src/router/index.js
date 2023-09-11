import Activation from "../pages/Activation";
import HomePage from "../pages/HomePage";
import Login from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import Profile from "../pages/ProfileUser";
import Address from "../pages/ProfileAddress";
import RegisterPage from "../pages/RegisterPage";
import BestSelling from "../pages/BestSelling";
import Product from "../pages/Product";
import Event from "../pages/Event";
import FAQ from "../pages/FAQ";

const routers = [
  {
    path: "/login",
    page: Login,
    isShowHeader: false,
  },
  {
    path: "/register",
    page: RegisterPage,
    isShowHeader: false,
  },
  {
    path: "/activation/:accessToken",
    page: Activation,
    isShowHeader: false,
  },
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/best-selling",
    page: BestSelling,
    isShowHeader: true,
  },
  {
    path: "/products",
    page: Product,
    isShowHeader: true,
  },
  {
    path: "/events",
    page: Event,
    isShowHeader: true,
  },
  {
    path: "/faq",
    page: FAQ,
    isShowHeader: true,
  },
  {
    path: "/profile",
    page: Profile,
    isShowHeader: true,
  },
  {
    path: "/address",
    page: Address,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
export default routers;
