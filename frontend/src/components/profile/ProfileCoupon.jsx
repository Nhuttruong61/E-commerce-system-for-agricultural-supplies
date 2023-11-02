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
      if (account?.giftPoints >= item.point) {
        const res = await updateCoupon(account._id, data);
        setIsLoading(false);
        if (res.success) {
          toast.success("Đỗi mã thành công");
          dispatch(getUser());
        }
      } else {
        toast.warning("Bạn không đủ điểm để đổi vocher này");
      }
    } catch (e) {
      toast.error("Bạn đẫ có mã giảm giá này");
      console.log(e);
      setIsLoading(false);
    }
  };
  console.log(dataCoupon);
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
            <div className=" grid md:grid-cols-2 w-full gap-2">
              {account?.voucher.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="flex border px-4 py-2 rounded shadow w-full mx-2 my-2 "
                  >
                    <div className=" w-[50%]">
                      <img
                        src={voucher}
                        alt=""
                        className="md:h-[50px] h-[40px]"
                      />
                    </div>
                    <div className="w-[50%]">
                      <p className="md:text-[16px] font-[500] text-[14px]">
                        {item?.name}
                      </p>
                      <p className="md:text-[16px] font-[500] text-[14px]">
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
          <div className="grid md:grid-cols-2 w-full gap-2">
            {dataCoupon?.length > 0 &&
              dataCoupon
                .filter((item) => item.userType === "user")
                .map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="flex border px-4 py-2 rounded shadow items-center w-full mx-2 my-2"
                    >
                      <div className="md:w-[40%] w-[30%]">
                        <img
                          src={voucher}
                          alt=""
                          className="md:h-[50px] h-[40px]"
                        />
                      </div>
                      <div className="md:w-[40%] w-[45%] px-2">
                        <p className="md:text-[16px] font-[500] text-[14px]">
                          {item?.name}
                        </p>
                        <p className="md:text-[16px] font-[500] text-[14px]">
                          Giảm: {item?.discountAmount.toLocaleString()} đ
                        </p>
                        <p className="md:text-[16px] font-[500] text-[14px]">
                          Điểm đổi: {item?.point.toLocaleString()}
                        </p>
                      </div>
                      <p
                        className="md:w-[15%] w-[25%] md:text-[16px] text-[12px] cursor-pointer bg-[#009b49] text-white flex hover:underline justify-center rounded"
                        onClick={() => handleAddVorcher(item)}
                      >
                        Đổi mã
                      </p>
                    </div>
                  );
                })}
          </div>
        </div>
        {account?.role === "member" && (
          <div className="w-full">
            <p className="font-[500] text-[16px]">Dành riêng cho bạn</p>
            <div className="grid md:grid-cols-2 w-full gap-2">
              {dataCoupon?.length > 0 &&
                dataCoupon
                  .filter((item) => item.userType === "Thành viên")
                  .map((item) => {
                    return (
                      <div
                        key={item._id}
                        className="flex border px-4 py-2 rounded shadow items-center w-full mx-2 my-2"
                      >
                        <div className="md:w-[40%] w-[30%]">
                          <img
                            src={voucher}
                            alt=""
                            className="md:h-[50px] h-[40px]"
                          />
                        </div>
                        <div className="md:w-[40%] w-[45%] px-2">
                          <p className="md:text-[16px] font-[500] text-[14px]">
                            {item?.name}
                          </p>
                          <p className="md:text-[16px] font-[500] text-[14px]">
                            Giảm: {item?.discountAmount.toLocaleString()} đ
                          </p>
                          <p className="md:text-[16px] font-[500] text-[14px]">
                            Điểm đổi: {item?.point.toLocaleString()}
                          </p>
                        </div>
                        <p
                          className="md:w-[15%] w-[25%] md:text-[16px] text-[12px] cursor-pointer bg-[#009b49] text-white flex hover:underline justify-center rounded"
                          onClick={() => handleAddVorcher(item)}
                        >
                          Đổi mã
                        </p>
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
      </div>
    </Loading>
  );
}

export default memo(ProfileCoupon);
