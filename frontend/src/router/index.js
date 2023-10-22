import Activation from "../pages/Account/Activation";
import HomePage from "../pages/HomePage";
import Login from "../pages/Account/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/Account/RegisterPage";
import BestSelling from "../pages/BestSelling";
import Product from "../pages/Product/Product";
import FAQ from "../pages/FAQ/FAQ";
import ProductDetailPage from "../pages/Product/ProductDetailPage";
import AdminPage from "../pages/AdminPage";
import EventPage from "../pages/EventPage";
import FAQInfomation from "../pages/FAQ/FAQInfomation";
import Profile from "../pages/Profile";
import InfomationOrder from "../pages/Order/InfomationOrder";
import OrderSuccessPage from "../pages/Order/OrderSuccessPage";
import CheckoutPage from "../pages/CheckoutPage";
import ForgotPassword from "../pages/Account/ForgotPassword";
import ResetPassword from "../pages/Account/ResetPassword";
import BlogPage from "../pages/Blog/BlogPage";
import BlogDetailPage from "../pages/Blog/BlogDetailPage";
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
    path: "/request-password",
    page: ForgotPassword,
    isShowHeader: false,
  },
  {
    path: "/reset-password/:resetToken",
    page: ResetPassword,
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
  {
    path: "/blog",
    page: BlogPage,
    isShowHeader: true,
  },
  {
    path: "/blog/:id",
    page: BlogDetailPage,
    isShowHeader: true,
  },
];
export default routers;
