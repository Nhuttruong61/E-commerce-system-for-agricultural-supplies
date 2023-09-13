import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { getAllCategory } from "../service/categoryService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getCaterogy } from "../redux/action/cateroryAction.js";
const Dropdown = ({ Text, items }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showText, setShowText] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelect = (item) => {
    setSelectedItem(item);
    setOpen(false);
    console.log(item.name);
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
    const res = await getAllCategory();
    dispatch(getCaterogy(res));
    return res;
  };
  const { data: dataCategory } = useQuery({
    queryKey: ["category"],
    queryFn: getDataCategory,
  });
  return (
    <div className="relative z-20 px-1">
      <span
        className="cursor-pointer h-[100%] w-auto flex justify-between items-center pl-4  font-[600] select-none rounded-t-md"
        onClick={() => setOpen(!open)}
      >
        <MenuOutlined style={{ fontSize: "20px" }} className="px-1" />
        {showText ? (
          <div className=" flex items-center justify-center text-[80%] md:text-[100%]">
            {selectedItem ? selectedItem.name : Text}
            <DownOutlined className="text-[80%] mt-1 mx-2" />
          </div>
        ) : null}
      </span>
      {open && (
        <div className="absolute bg-white border rounded shadow-md mt-2">
          <ul className="py-2 px-2">
            {dataCategory?.categories?.map((item) => (
              <li
                key={item._id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200 flex items-center "
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
export default Dropdown;
