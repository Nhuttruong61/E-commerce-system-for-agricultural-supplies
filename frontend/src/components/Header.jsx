import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { BsBox } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../redux/action/userAction";
import DropdownComponet from "./Dropdown";
import Navbar from "./Navbar";
import logo from "../assets/logo/logo.png";
import Cart from "./Cart/Cart";
import { clearQuantity } from "../redux/action/cartAction";

function Header() {
  const user = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.product);
  const [show, setShow] = useState(true);
  const [productData, setProductData] = useState([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [ishownInUser, setIsShownInUser] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setShow(window.innerWidth > 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (products && products.data.length > 0) {
      let res = products.data;
      setProductData(res);
    }
  }, [products]);
  const handleSearch = (e) => {
    const searchItem = e.target.value;
    setSearch(searchItem);
    if (productData && productData.length > 0) {
      const filterSearch =
        productData &&
        productData.filter((product) => {
          return product.name.toLowerCase().includes(searchItem.toLowerCase());
        });
      setSearchData(filterSearch);
    }
  };
  const handleSubmitSearch = () => {
    navigate(`/products?name=${search}`);
    setSearch("");
  };
  const handleLogout = () => {
    dispatch(LogoutUser());
    dispatch(clearQuantity());
    setIsShownInUser(false);
    navigate("/login");
  };
  const handleNavigateProfile = () => {
    setIsShownInUser(false);
    navigate("/profile");
  };

  const handleNavigateAdmin = () => {
    setIsShownInUser(false);
    navigate("/system/admin");
  };
  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <div>
      <div className=" flex justify-between h-[74px] items-center md:px-8 w-full px-1">
        <Link to="/" className=" w-[25%] flex items-center">
          <img src={logo} alt="" className=" md:w-[10%] w-[40%]" />
          {show && (
            <p className="text-xs md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4b8600] to-[#e49200]">
              Nông Nghiệp Xanh
            </p>
          )}
        </Link>
        <div
          className={
            show
              ? "h-[30px] md:h-[42px] border bg-[white] items-center flex  w-[50%]   rounded-[8px]"
              : "h-[30px] md:h-[42px] border bg-[white] items-center flex  w-[50%]   rounded-[8px]"
          }
        >
          <input
            className="h-[30px]  items-center outline-none w-[90%] rounded-l-[8px] px-2 text-[80%] md:text-[100%]"
            placeholder="Nhập tên sản phẩm cần tìm..."
            value={search}
            onChange={handleSearch}
          />
          {searchData && searchData.length !== 0 && search !== "" ? (
            <div className="absolute min-h-[30vh] w-[48%] top-[10%] mt-2 bg-white shadow-md border rounded overflow-y-auto z-20 text-[80%] md:text-[100%]">
              {searchData.map((item, index) => {
                return (
                  <Link
                    to={`/product/details/${item._id}`}
                    key={index}
                    onClick={() => setSearch("")}
                  >
                    <div className="w-full flex items-start py-3">
                      <img
                        src={item.images[0].url}
                        alt=""
                        className="w-[40px] h-[40px] mr-[10px]"
                      />
                      <h2 className="">{item.name}</h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}

          <div className="h-full items-center flex justify-center w-[10%]  bg-[#73c509] hover:bg-[#4d8208] rounded-r-[8px] cursor-pointer">
            <SearchOutlined
              className=" text-white text-[12px] md:text-[24px]"
              onClick={handleSubmitSearch}
            />
          </div>
        </div>
        <div
          className={
            show
              ? " flex justify-between items-center w-[25%]"
              : " flex justify-between items-center w-[40%]"
          }
        >
          <div className="flex justify-center items-center px-4">
            {show ? (
              <div className="border border-[#73c509] rounded-full mx-2 ">
                {user?.account?.avatar ? (
                  <img
                    className="w-[40px] h-[40px] object-cover rounded-full"
                    src={user.account.avatar.url}
                    alt=""
                  />
                ) : (
                  <UserOutlined className="text-[24px] p-2 text-[#73C509]" />
                )}
              </div>
            ) : null}
            <div className="relative z-10 text-[50%] md:text-[100%] font-[600]">
              {user?.isAuthenticated ? (
                <div
                  className="cursor-pointer "
                  onClick={() => setIsShownInUser(!ishownInUser)}
                >
                  <p>{user.account.name}</p>
                </div>
              ) : (
                <div className="md:text-[0.8rem]  ">
                  <p
                    className="hover:text-red-500 cursor-pointer font-[600]"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Đăng nhập
                  </p>
                  <p
                    className="hover:text-red-500 cursor-pointer font-[600]"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Đăng kí
                  </p>
                </div>
              )}
              {ishownInUser && (
                <div className="absolute h-auto w-[120px] bg-white rounded-[4px]">
                  <div
                    className="hover:bg-[#4B8600] hover:text-white cursor-pointer p-2 flex items-center"
                    onClick={handleNavigateProfile}
                  >
                    <UserOutlined />
                    <p className="ml-1">Tài khoản</p>
                  </div>

                  {user?.account?.role === "admin" && (
                    <div className="hover:bg-[#4B8600] hover:text-white cursor-pointer p-2 flex items-center">
                      <SettingOutlined />
                      <p className="ml-1" onClick={handleNavigateAdmin}>
                        Quản lý
                      </p>
                    </div>
                  )}
                  <div className="hover:bg-[#4B8600] cursor-pointer hover:text-white p-2 flex items-center">
                    <BsBox />
                    <p className="ml-1" onClick={handleNavigateProfile}>
                      Đơn hàng
                    </p>
                  </div>
                  <div className="hover:bg-[#4B8600] cursor-pointer hover:text-white p-2 flex items-center">
                    <CloseOutlined />
                    <p className="ml-1" onClick={handleLogout}>
                      Thoát
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className="relative cursor-pointer"
            onClick={() => setOpenCart(!openCart)}
          >
            <ShoppingCartOutlined className="text-[24px] mx-2 " />
            <div className="absolute border border-[#ccc] rounded-[50%] right-[-4px] top-0 bg-[#73c509]">
              <p className="text-[12px] px-[5px] text-white font-[800]">
                {cart.length ? cart.length : "0"}
              </p>
            </div>
          </div>
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
        </div>
      </div>
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition 800px:flex items-center justify-between w-full`}
      >
        <div className="bg-[#73c509] relative w-full mt-0 shadow-md h-[60px] flex  items-center  ">
          <div className="  h-full  flex items-center pl-o sm:pl-[10%] w-[10%] sm:w-[30%] ">
            <DropdownComponet Text="Danh mục"></DropdownComponet>
          </div>
          <Navbar />
        </div>
      </div>
    </div>
  );
}

export default Header;
