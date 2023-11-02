import React, { useEffect, useState } from "react";
import * as CouponService from "../../service/couponService";
function AdminCoupon() {
  const [dataCoupon, setDataCoupon] = useState(null);
  const fetchdataCoupon = async () => {
    try {
      const res = await CouponService.getCoupouns();
      console.log(res);
      if (res.success) {
        setDataCoupon(res.coupons);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchdataCoupon();
  }, []);
  return <div>AdminCoupon</div>;
}

export default AdminCoupon;
