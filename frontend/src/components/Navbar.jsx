import React from "react";
import { navItems } from "../static/data";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLinkClick = (item) => {
    navigate(item.url);
    console.log("texxt", item);
  };
  return (
    <div className="flex h-full items-center w-[90%] text-[80%] md:text-[100%] pl-[4%] md:pl-[16%]">
      {navItems?.map((item, i) => (
        <div key={i} className="mx-2 font-[600]">
          <Link
            to={item.url}
            onClick={() => handleLinkClick(item)}
            className={`${
              location.pathname === item.url ? "text-red-600" : "text-black"
            }`}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Navbar;
