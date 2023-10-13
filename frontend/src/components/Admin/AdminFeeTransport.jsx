import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../Table";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getAllFee } from "../../redux/action/feeAction";
import * as FreeStransPortService from "../../service/transportFeeService";
function AdminFeeTransport() {
  const { data } = useSelector((state) => state.fee);
  const dispatch = useDispatch();
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFeeStransport, setIdFeeStransport] = useState("");
  const [editFeeCost, setEditFeeCost] = useState({
    title: "",
    cost: "",
    freeShipping: "",
  });
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
              freeShipping: item.freeShipping,
            });
          }}
        >
          <EditOutlined className="text-green-600 border border-[green] py-2 px-1 rounded-[4px]" />{" "}
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
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Cost",
      dataIndex: "cost",
    },
    {
      title: "Tree Shipping",
      dataIndex: "freeShipping",
    },
    {
      title: "Action",
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
    setShowModalEdit(false);
  };
  const okButtonEdit = {
    style: {
      color: "green",
      border: "1px solid #ccc",
    },
  };

  return (
    <div className="w-full flex flex-col">
      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Edit fee cost"
        open={showModalEdit}
        onOk={handleEditFeeStransport}
        onCancel={handleCancel}
        okButtonProps={okButtonEdit}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Title</p>
          <input
            value={editFeeCost.title}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditFeeCost({ ...editFeeCost, title: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Cost</p>
          <input
            value={editFeeCost.cost}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditFeeCost({ ...editFeeCost, cost: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Free Strasport</p>
          <input
            value={editFeeCost.freeShipping}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditFeeCost({ ...editFeeCost, freeShipping: e.target.value })
            }
          />
        </label>
      </Modal>
    </div>
  );
}

export default AdminFeeTransport;
