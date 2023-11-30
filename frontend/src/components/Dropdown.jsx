import React, { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCaterogy } from "../redux/action/cateroryAction.js";
const Dropdown = ({ Text }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showText, setShowText] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataCategory = useSelector((state) => state.category);
  const ref = useRef(null);
  const handleSelect = (item) => {
    setSelectedItem(item);
    setOpen(false);
    navigate(`/products?category=${item.name}`);
  };
  useEffect(() => {
    const handleResize = () => {
      setShowText(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const getDataCategory = async () => {
    dispatch(getCaterogy());
  };
  useEffect(() => {
    getDataCategory();
  }, []);

  const handleClickOutside = () => {
    if (ref.current) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative z-10 px-1 w-[220px]"
      ref={ref}
      onClick={(e) => e.stopPropagation()}
    >
      <span
        className="cursor-pointer h-[100%] w-auto flex items-center pl-4  font-[600] select-none rounded-t-md text-white"
        onClick={() => setOpen(!open)}
      >
        <MenuOutlined style={{ fontSize: "20px" }} className="px-1" />
        {showText ? (
          <div className=" flex items-center min-w-[120px] justify-center text-[80%] md:text-[100%] ">
            {selectedItem ? selectedItem.name : Text}
            <DownOutlined className="text-[80%] mt-1 mx-2" />
          </div>
        ) : null}
      </span>
      {open && (
        <div className="absolute bg-white border rounded shadow-md mt-5 w-[180px] fade-in-from-top-animation right-0">
          <ul>
            {dataCategory?.data?.categories?.map((item) => (
              <li
                key={item._id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200 flex items-center  rounded"
                onClick={() => handleSelect(item)}
              >
                <img
                  style={{ width: "25px", height: "25px", paddingRight: "2px" }}
                  src={item.images[0].url}
                  alt=""
                />
                <p className="text-xs font-[500] px-2"> {item.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default memo(Dropdown);
