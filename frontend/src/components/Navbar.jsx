import React, { memo } from "react";
import { navItems } from "../static/data";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLinkClick = (item) => {
    navigate(item.url);
  };
  return (
    <div className="flex h-full items-center w-[100%] text-[82%] xl:text-[120%] pl-[4%] md:pl-[16%]">
      {navItems?.map((item, i) => (
        <div key={i} className="mx-2 font-[600]">
          <Link
            to={item.url}
            onClick={() => handleLinkClick(item)}
            className={`${
              location.pathname === item.url ? "text-red-600" : "text-white"
            }`}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default memo(Navbar);
