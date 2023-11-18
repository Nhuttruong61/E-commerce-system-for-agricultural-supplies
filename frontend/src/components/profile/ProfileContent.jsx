import React, { memo } from "react";
import ProfileUser from "../profile/ProfileUser";
import ProfileAddress from "../profile/ProfileAddress";
import ProfileOrder from "./ProfileOrder";
import ProfileCoupon from "./ProfileCoupon";
import ProfileChangePassword from "./ProfileChangePassword";

function ProfileContent({ active }) {
  let content = null;
  if (active === 1) {
    content = <ProfileUser />;
  } else if (active === 2) {
    content = <ProfileOrder />;
  } else if (active === 3) {
    content = <ProfileAddress />;
  } else if (active === 4) {
    content = <ProfileCoupon />;
  } else if (active === 5) {
    content = <ProfileChangePassword />;
  }
  return (
    <div className="w-full rounded-[10px] mx-4 overflow-x-auto bg-white">
      {content}
    </div>
  );
}

export default memo(ProfileContent);
