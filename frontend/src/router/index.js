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
  }
];
export default routers;
