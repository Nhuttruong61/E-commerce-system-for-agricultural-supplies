import Activation from "../pages/Activation";
import HomePage from "../pages/HomePage";
import Login from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

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
  }
];
export default routers;
