import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../Table";
import { Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getAllFee } from "../../redux/action/feeAction";
import * as FreeStransPortService from "../../service/transportFeeService";
import { AiOutlineCloudUpload } from "react-icons/ai";
function AdminFeeTransport() {
  const { data } = useSelector((state) => state.fee);
  const dispatch = useDispatch();
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFeeStransport, setIdFeeStransport] = useState("");
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [addFeeCost, setAddFeeCost] = useState({
    title: "",
    cost: "",
    weight: "",
    freeShipping: "",
  });
  const [editFeeCost, setEditFeeCost] = useState({
    title: "",
    cost: "",
    weight: "",
    freeShipping: "",
  });
  const [idFee, setIdFee] = useState("");
  useEffect(() => {
    dispatch(getAllFee());
  }, []);
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1"
          onClick={() => {
            setShowModalEdit(true);
            setIdFeeStransport(item._id);
            setEditFeeCost({
              title: item.title,
              cost: item.cost,
              weight: item.weight,
              freeShipping: item.freeShipping,
            });
          }}
        >
          <EditOutlined className="text-green-600 border border-[green] py-2 px-1 rounded-[4px]" />{" "}
        </div>
        <div
          className="mx-1"
          onClick={() => {
            setIdFee(item._id);
            setShowModalDelete(true);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
        </div>
      </div>
    );
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Giá vận chuyển trên kg",
      dataIndex: "cost",
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
    },
    {
      title: "Giá miễn ship",
      dataIndex: "freeShipping",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (data && data) {
    dataTable = data.map((item) => {
      return {
        ...item,
      };
    });
  }

  const handleEditFeeStransport = async () => {
    setShowModalEdit(false);
    setIsLoading(true);
    const res = await FreeStransPortService.updateTransportFee(
      idFeeStransport,
      editFeeCost
    );
    if (res.success) {
      dispatch(getAllFee());
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };
  const handleCancel = () => {
    setShowModalAdd(false);
    setShowModalEdit(false);
    setShowModalDelete(false);
  };
  const okButtonEdit = {
    style: {
      color: "green",
      border: "1px solid #ccc",
    },
  };
  const handleAddFeeCost = async () => {
    setIsLoading(true);
    setShowModalAdd(false);
    if (
      addFeeCost.title === "" ||
      addFeeCost.weight === "" ||
      addFeeCost.cost === "" ||
      addFeeCost.freeShipping === ""
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
    }
    const res = await FreeStransPortService.createTransportFee(addFeeCost);
    setIsLoading(false);
    if (res.success) {
      toast.success("Tạo phí vận chuyển thành công");
      dispatch(getAllFee());
    }
  };
  const handleDeleteFee = () => {
    setIsLoading(true);
    setShowModalDelete(false);
    const res = FreeStransPortService.deleteTransportFee(idFee);
    setIsLoading(false);
    if (res.success) {
      toast.success("Xóa phí vận chuyển thành công");
      dispatch(getAllFee());
    }
  };
  const okButtonAdd = {
    style: {
      color: "green",
      border: "1px solid #ccc",
    },
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  return (
    <div className="w-full flex flex-col">
      <div
        className=" flex  md:flex-row m-2 cursor-pointer rounded w-[25%]"
        onClick={() => setShowModalAdd(true)}
      >
        <span className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-red-500  text-white">
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
        title="Thêm giá vận chuyển"
        open={showModalAdd}
        onOk={handleAddFeeCost}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tiêu đề</p>
          <input
            type="text"
            value={addFeeCost.title}
            placeholder="Nhận tiêu đề"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddFeeCost({ ...addFeeCost, title: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá tiền</p>
          <input
            value={addFeeCost.cost}
            placeholder="Nhập giá tiền"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddFeeCost({ ...addFeeCost, cost: e.target.value })
            }
          />
        </label>

        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Cân nặng</p>
          <input
            type="text"
            value={addFeeCost.weight}
            placeholder="Nhập số cân nặng"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddFeeCost({ ...addFeeCost, weight: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá miễn ship</p>
          <input
            type="text"
            value={addFeeCost.freeShipping}
            placeholder="Nhâp giá tiền được miễn ship"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddFeeCost({ ...addFeeCost, freeShipping: e.target.value })
            }
          />
        </label>
      </Modal>
      <Modal
        title="Chỉnh sửa giá"
        open={showModalEdit}
        onOk={handleEditFeeStransport}
        onCancel={handleCancel}
        okButtonProps={okButtonEdit}
        okType="none"
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" onClick={handleEditFeeStransport}>
            Xác nhận
          </Button>,
        ]}
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tiêu đề</p>
          <input
            value={editFeeCost.title}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditFeeCost({ ...editFeeCost, title: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá</p>
          <input
            value={editFeeCost.cost}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditFeeCost({ ...editFeeCost, cost: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Cân nặng</p>
          <input
            value={editFeeCost.weight}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditFeeCost({ ...editFeeCost, weight: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá miễn ship</p>
          <input
            value={editFeeCost.freeShipping}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditFeeCost({ ...editFeeCost, freeShipping: e.target.value })
            }
          />
        </label>
      </Modal>
      <Modal
        title="Xóa phí vận chuyển"
        open={showModalDelete}
        onOk={handleDeleteFee}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>Bạn có muốn chắc xóa phí này?</p>
      </Modal>
    </div>
  );
}

export default memo(AdminFeeTransport);
