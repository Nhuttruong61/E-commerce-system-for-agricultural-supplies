import React, { useEffect, useLayoutEffect, useState } from "react";
import ProfileSideBar from "../components/profile/ProfileSideBar";
import ProfileContent from "../components/profile/ProfileContent";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Profile() {
  const queryString = window.location.search;
  const queryStringCut = queryString.split("?")[1];
  const numberValue = parseInt(queryStringCut);
  const [active, setActive] = useState(numberValue ? numberValue : 1);
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useLayoutEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="flex flex-col bg-[#f4f1f4] w-full">
      <div className=" flex  py-10  w-full">
        <div className="w-[50px] 800px:w-[335px] ">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
