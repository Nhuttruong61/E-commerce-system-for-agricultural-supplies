import React, { useState } from "react";
import ProfileSideBar from "../components/profile/ProfileSideBar";
import ProfileContent from "../components/profile/ProfileContent";
import Footer from "../components/Footer";
function Profile() {
  const queryString = window.location.search;
  const queryStringCut = queryString.split("?")[1];
  const numberValue = parseInt(queryStringCut);
  const [active, setActive] = useState(numberValue ? numberValue : 1);
  return (
    <div className="flex flex-col">
      <div className=" flex bg-[#f4f1f4] py-10 md:min-h-[80vh]">
        <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%]">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
