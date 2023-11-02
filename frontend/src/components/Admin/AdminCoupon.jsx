import React, { useEffect, useState } from "react";
import * as CouponService from "../../service/couponService";
import { AiOutlineCloudUpload } from "react-icons/ai";
import TableComponent from "../Table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { toast } from "react-toastify";
function AdminCoupon() {
  const [dataCoupon, setDataCoupon] = useState(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idcoupon, setIdCoupon] = useState(null);
  const [addCoupons, setAddCoupons] = useState({
    name: "",
    code: "",
    discountAmount: "",
    point: "",
  });
  const [editCoupons, setEditCoupons] = useState({
    name: "",
    code: "",
    discountAmount: "",
    point: "",
  });
  const fetchdataCoupon = async () => {
    try {
      const res = await CouponService.getCoupouns();
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
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1"
          onClick={() => {
            setIdCoupon(item._id);
            setShowModalDelete(true);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
        </div>
        <div
          className="mx-1"
          onClick={() => {
            setIdCoupon(item._id);
            setShowModalEdit(true);
            setShowModalEdit(true);
            setEditCoupons({
              name: item.name,
              code: item.code,
              discountAmount: item.discountAmount,
              point: item.point,
            });
          }}
        >
          <EditOutlined className="text-green-600 border border-[green] py-2 px-1 rounded-[4px]" />
        </div>
      </div>
    );
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "sst",
    },
    {
      title: "Tên mã",
      dataIndex: "name",
    },
    {
      title: "Mã code",
      dataIndex: "code",
    },
    {
      title: "Sổ tiền",
      dataIndex: "discountAmount",
      sorter: (a, b) => a.discountAmount - b.discountAmount,
    },
    {
      title: "Sổ điểm cần đổi",
      dataIndex: "point",
      sorter: (a, b) => a.point - b.point,
    },

    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (dataCoupon?.length > 0) {
    dataTable = dataCoupon?.map((item, index) => {
      return {
        key: item._id,
        sst: index + 1,
        ...item,
      };
    });
  }
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const handleCancel = () => {
    setShowModalAdd(false);
    setShowModalEdit(false);
    setShowModalDelete(false);
  };
  const handleAddCoupon = async () => {
    try {
      if (
        !addCoupons.name ||
        !addCoupons.code ||
        !addCoupons.discountAmount ||
        !addCoupons.point
      ) {
        toast.warning("Vui lòng nhập đầy đủ thông tin");
      } else {
        setShowModalAdd(false);
        setIsLoading(true);
        const res = await CouponService.createCoupouns(addCoupons);
        setIsLoading(false);
        if (res.success) {
          fetchdataCoupon();
          toast.success("Thêm mã giảm giá thành công");
          setDataCoupon({
            name: "",
            code: "",
            discountAmount: "",
            point: "",
          });
        }
      }
    } catch (e) {
      console.log(e);
      setShowModalAdd(false);
    }
  };
  const handleEditCoupon = async () => {
    try {
      if (
        !editCoupons.name ||
        !editCoupons.code ||
        !editCoupons.discountAmount ||
        !editCoupons.point
      ) {
        toast.warning("Vui lòng nhập đầy đủ thông tin");
      } else {
        setShowModalEdit(false);
        setIsLoading(true);
        const res = await CouponService.editCoupoun(idcoupon, editCoupons);
        setIsLoading(false);
        if (res.success) {
          fetchdataCoupon();
          toast.success("Thay đổi thành công");
          setDataCoupon({
            name: "",
            code: "",
            discountAmount: "",
            point: "",
          });
        }
      }
    } catch (e) {
      console.log(e);
      setShowModalEdit(false);
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      setShowModalDelete(false);
      setIsLoading(true);
      const res = await CouponService.deleteCoupoun(idcoupon);
      setIsLoading(false);
      if (res.success) {
        fetchdataCoupon();
        toast.success("Xóa mã thành công");
      }
    } catch (e) {
      console.log(e);
      setShowModalDelete(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex  md:flex-row m-2 justify-between">
        <span
          className="border-[2px] flex justify-center rounded cursor-pointer items-center px-2 py-1 bg-red-500  text-white"
          onClick={() => setShowModalAdd(true)}
        >
          <AiOutlineCloudUpload className="md:text-[30px] text-[20px]" />
          <h2 className="font-[600] px-1 ">Tạo mới</h2>
        </span>
      </div>
      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Thêm mã giảm giá mới"
        open={showModalAdd}
        onOk={handleAddCoupon}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tên mã giảm</p>
          <input
            value={addCoupons.name}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddCoupons({ ...addCoupons, name: e.target.value })
            }
            placeholder="Nhập tên mã giảm giá"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Mã code</p>
          <input
            value={addCoupons.code}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddCoupons({ ...addCoupons, code: e.target.value })
            }
            placeholder="Nhập mã giảm giá"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Số tiền</p>
          <input
            value={addCoupons.discountAmount}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddCoupons({ ...addCoupons, discountAmount: e.target.value })
            }
            placeholder="Nhập số tiền giảm"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Số điểm</p>
          <input
            value={addCoupons.point}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddCoupons({ ...addCoupons, point: e.target.value })
            }
            placeholder="Nhập số điểm càn dùng để đổi "
          />
        </label>
      </Modal>
      <Modal
        title="Chỉnh sửa mã giảm giá"
        open={showModalEdit}
        onOk={handleEditCoupon}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tên mã giảm</p>
          <input
            value={editCoupons.name}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditCoupons({ ...editCoupons, name: e.target.value })
            }
            placeholder="Nhập tên mã giảm giá"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Mã code</p>
          <input
            value={editCoupons.code}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditCoupons({ ...editCoupons, code: e.target.value })
            }
            placeholder="Nhập mã giảm giá"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Số tiền</p>
          <input
            value={editCoupons.discountAmount}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditCoupons({ ...editCoupons, discountAmount: e.target.value })
            }
            placeholder="Nhập số tiền giảm"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Số điểm</p>
          <input
            value={editCoupons.point}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditCoupons({ ...editCoupons, point: e.target.value })
            }
            placeholder="Nhập số điểm càn dùng để đổi "
          />
        </label>
      </Modal>
      <Modal
        title="Xóa mã giảm giá"
        open={showModalDelete}
        onOk={handleDeleteCoupon}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Bạn có muốn chăc xóa sản phảm này?`} </p>
      </Modal>
    </div>
  );
}

export default AdminCoupon;
