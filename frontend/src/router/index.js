import Activation from "../pages/Activation";
import HomePage from "../pages/HomePage";
import Login from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import BestSelling from "../pages/BestSelling";
import Product from "../pages/Product";
import FAQ from "../pages/FAQ";
import ProductDetailPage from "../pages/ProductDetailPage";
import AdminPage from "../pages/AdminPage";
import EventPage from "../pages/EventPage";
import FAQInfomation from "../pages/FAQInfomation";
import Profile from "../pages/Profile";
import InfomationOrder from "../pages/InfomationOrder";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import CheckoutPage from "../pages/CheckoutPage";
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
    page: EventPage,
    isShowHeader: true,
  },
  {
    path: "/faq",
    page: FAQ,
    isShowHeader: true,
  },
  {
    path: "/information/order/:id",
    page: InfomationOrder,
    isShowHeader: true,
  },
  {
    path: "/checkout",
    page: CheckoutPage,
    isShowHeader: true,
  },
  {
    path: "/order/seccess",
    page: OrderSuccessPage,
    isShowHeader: true,
  },
  {
    path: "/faq/:id",
    page: FAQInfomation,
    isShowHeader: true,
  },
  {
    path: "/profile",
    page: Profile,
    isShowHeader: true,
  },
  {
    path: "/product/details/:id",
    page: ProductDetailPage,
    isShowHeader: true,
  },

  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true,
  },
];
export default routers;
