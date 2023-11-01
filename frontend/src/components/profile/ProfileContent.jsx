import React, { memo } from "react";
import ProfileUser from "../profile/ProfileUser";
import ProfileAddress from "../profile/ProfileAddress";
import ProfileOrder from "./ProfileOrder";
import ProfileCoupon from "./ProfileCoupon";

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
  }
  return <div className="w-full rounded-[10px] mx-4">{content}</div>;
}

export default memo(ProfileContent);
