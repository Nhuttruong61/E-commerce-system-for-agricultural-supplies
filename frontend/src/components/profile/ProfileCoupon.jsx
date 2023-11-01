import React, { memo, useEffect, useState } from "react";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import { getCoupouns } from "../../service/couponService";
import voucher from "../.././assets/image/mgg.png";
import { updateCoupon } from "../../service/userService";
import { toast } from "react-toastify";
import { getUser } from "../../redux/action/userAction";
function ProfileCoupon() {
  const { account } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [dataCoupon, setDataCoupon] = useState(null);
  const fetchDataCoupon = async () => {
    const res = await getCoupouns();
    if (res.success) {
      setDataCoupon(res.coupons);
    }
  };
  useEffect(() => {
    fetchDataCoupon();
  }, []);
  const handleAddVorcher = async (item) => {
    try {
      setIsLoading(true);
      const data = { coupons: { ...item } };
      const res = await updateCoupon(account._id, data);
      setIsLoading(false);
      if (res.success) {
        toast.success("Đỗi mã thành công");
        dispatch(getUser());
      }
    } catch (e) {
      toast.error("Bạn đẫ có mã giảm giá này");
      console.log(e);
      setIsLoading(false);
    }
  };
  return (
    <Loading isLoading={isLoading}>
      <div className="w-full  h-auto bg-white rounded-[10px] px-2">
        <p className="text-[24px] font-[600] py-1 ">Tất cả voucher</p>
        <div className="w-full flex items-center">
          <p className="font-[500] text-[16px]">Điểm khả dụng:</p>
          <p className="pl-2 text-[16px]">{account?.giftPoints}</p>
        </div>
        {account?.voucher.length > 0 && (
          <div className="w-full py-2">
            <p className="font-[500] text-[16px]">Voucher của bạn</p>
            <div className=" md:flex w-full">
              {account?.voucher.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="flex border px-4 py-2 rounded shadow w-full mx-2 my-2 "
                  >
                    <div className="w-[50%]">
                      <img src={voucher} alt="" className="h-[50px]" />
                    </div>
                    <div className="w-[50%]">
                      <p className="text-[16px] font-[500]">{item?.name}</p>
                      <p className="text-[16px] font-[500]">
                        Giảm: {item?.discountAmount.toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="w-full">
          <p className="font-[500] text-[16px]">Nhận thêm voucher</p>
          <div className="w-full md:flex">
            {dataCoupon?.length > 0 &&
              dataCoupon?.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="flex border px-4 py-2 rounded shadow items-center w-full mx-2 my-2"
                  >
                    <div className="w-[50%]">
                      <img src={voucher} alt="" className="h-[50px]" />
                    </div>
                    <div className="w-[40%]">
                      <p className="text-[16px] font-[500]">{item?.name}</p>
                      <p className="text-[16px] font-[500]">
                        Giảm: {item?.discountAmount.toLocaleString()} đ
                      </p>
                      <p className="text-[16px] font-[500]">
                        Điểm đổi: {item?.point.toLocaleString()}
                      </p>
                    </div>
                    <p
                      className="w-[10%] cursor-pointer hover:text-[#009b49] hover:underline"
                      onClick={() => handleAddVorcher(item)}
                    >
                      Đổi mã
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default memo(ProfileCoupon);
