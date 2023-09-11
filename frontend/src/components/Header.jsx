import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  DropboxOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../redux/action/userAction";
import { categoriesData, productData } from "../static/data";
import DropdownComponet from "./Dropdown";
import Navbar from "./Navbar";

function Header() {
  const [show, setShow] = useState(true);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState(null);
  // const [productData, setProductData] = useState([]);
  const [ishownInUser, setIsShownInUser] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

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
  const handleSearch = (e) => {
    const searchItem = e.target.value;
    setSearch(searchItem);
    const filterSearch = productData.filter((product) =>
      product.name.toLowerCase().includes(searchItem.toLowerCase())
    );
    setSearchData(filterSearch);
  };

  const handleLogout = () => {
    dispatch(LogoutUser());
    setIsShownInUser(false);
    navigate("/login");
  };
  const handleNavigateProfile = () => {
    setIsShownInUser(false);
    navigate("/profile");
  };
  const handleOnchangeAddress = () => {
    navigate("/address");
    setIsShownInUser(false);
  };
  return (
    <div>
      <div className="bg-[#101010] flex justify-between h-[74px] items-center px-8 w-full">
        <Link
          to="/"
          className="text-xs md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-red-700 w-[25%]"
        >
          Spot Technology
        </Link>
        <div
          className={
            show
              ? "h-[30px] md:h-[42px] bg-[white] items-center flex  w-[50%]   rounded-[8px]"
              : "h-[30px] md:h-[42px] bg-[white] items-center flex  w-[50%]   rounded-[8px]"
          }
        >
          <input
            className="h-[30px]  items-center outline-none w-[90%] rounded-l-[8px] px-2 text-[80%] md:text-[100%]"
            placeholder="Nhập tên sản phẩm cần tìm..."
            value={search}
            onChange={handleSearch}
          />
          {searchData && searchData?.length !== 0 && search !== "" ? (
            <div className="absolute min-h-[30vh] w-[48%] top-[10%] mt-2 bg-white shadow-md border rounded overflow-y-auto z-20 text-[80%] md:text-[100%]">
              {searchData.map((item, index) => {
                const res = item.name;
                const productName = res.replace(/\s+/g, "_");
                return (
                  <Link to={`/product/${productName}`} key={index}>
                    <div className="w-full flex items-start py-3">
                      <img
                        src={item.image_Url[0].url}
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

          <div className="h-full items-center flex justify-center w-[10%]  bg-[#5e5e60] hover:bg-[#525254] rounded-r-[8px] cursor-pointer">
            <SearchOutlined className=" text-white" />
          </div>
        </div>
        <div
          className={
            show
              ? "text-white flex justify-between items-center w-[25%]"
              : "text-white flex justify-between items-center w-[40%]"
          }
        >
          <div className="flex justify-center items-center px-4">
            {show ? (
              <div className="border border-[white] rounded-full mx-2 ">
                {user?.account?.avatar ? (
                  <img
                    className="w-[40px] h-[40px] object-cover rounded-full"
                    src={user.account.avatar.url}
                    alt=""
                  />
                ) : (
                  <UserOutlined className="text-[24px] p-2" />
                )}
              </div>
            ) : null}
            <div className="relative z-10 text-[80%] md:text-[100%]">
              {user?.isAuthenticated ? (
                <div
                  className="cursor-pointer "
                  onClick={() => setIsShownInUser(!ishownInUser)}
                >
                  <p>{user.account.name}</p>
                </div>
              ) : (
                <div className="text-[0.8rem]">
                  <p
                    className="hover:text-red-500 cursor-pointer"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Đăng nhập
                  </p>
                  <p
                    className="hover:text-red-500 cursor-pointer"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Đăng kí
                  </p>
                </div>
              )}
              {ishownInUser && (
                <div className="absolute h-auto w-[120px] bg-[#111111] rounded-[4px]">
                  <div
                    className="hover:bg-gray-700 cursor-pointer p-2 flex items-center"
                    onClick={handleNavigateProfile}
                  >
                    <UserOutlined />
                    <p className="ml-1">Tài khoản</p>
                  </div>
                  <div className="hover:bg-gray-700 cursor-pointer p-2 flex items-center">
                    <DropboxOutlined />
                    <p className="ml-1">Đơn hàng</p>
                  </div>
                  <div className="hover:bg-gray-700 cursor-pointer p-2 flex items-center">
                    <HomeOutlined />
                    <p className="ml-1" onClick={handleOnchangeAddress}>
                      Địa chỉ
                    </p>
                  </div>
                  <div className="hover:bg-gray-700 cursor-pointer p-2 flex items-center">
                    <CloseOutlined />
                    <p className="ml-1" onClick={handleLogout}>
                      Thoát
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative cursor-pointer">
            <ShoppingCartOutlined className="text-[24px] mx-2 " />
            <div className="absolute border border-[white] rounded-[50%] right-[-4px] top-0 bg-white">
              <p className="text-[12px] px-[5px] text-red-600 font-[800]">1</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white relative w-full mt-0 shadow-md h-[60px] flex  items-center ">
        <div className="  h-full  flex items-center pl-o sm:pl-[10%] w-[10%] sm:w-[30%] ">
          <DropdownComponet
            Text="Doanh mục"
            items={categoriesData}
          ></DropdownComponet>
        </div>
        <Navbar />
      </div>
    </div>
  );
}

export default Header;
