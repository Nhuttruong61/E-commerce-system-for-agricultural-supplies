import React, { memo, useEffect, useState } from "react";
import TableComponent from "../common/Table";
import { Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { AiOutlineCloudUpload } from "react-icons/ai";
import * as ReceiptService from "../../service/receiptService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
function AdminReceipt() {
  const [dataReceipt, setDataReceipt] = useState(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [idReceipt, setIdReceipt] = useState(null);
  const [addReceipt, setAddReceipt] = useState({
    productId: "",
    originPrice: "",
    quantity: "",
  });
  const [editReceipt, setEditReceipt] = useState({
    productId: "",
    originPrice: "",
    quantity: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSelector((state) => state.product);
  const fetchDataReceipt = async () => {
    try {
      setIsLoading(true);
      const res = await ReceiptService.getAllReceipt();
      setIsLoading(false);
      if (res.success) {
        setDataReceipt(res.receipt);
      }
    } catch (e) {
      setIsLoading(false);

      console.log(e);
    }
  };
  useEffect(() => {
    fetchDataReceipt();
  }, []);
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1 cursor-pointer"
          onClick={() => {
            setIdReceipt(item.id);
            setShowModalEdit(true);
            setEditReceipt({
              productId: item.product,
              originPrice: item.originPrice,
              quantity: item.quantity,
            });
          }}
        >
          <EditOutlined className="text-green-600 border border-[green] py-2 px-1 rounded-[4px]" />
        </div>
        <div
          className="mx-1 cursor-pointer"
          onClick={() => {
            setIdReceipt(item.id);
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
      title: "STT",
      dataIndex: "stt",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Giá nhập",
      dataIndex: "originPrice",
    },
    {
      title: "Số lượng ",
      dataIndex: "quantity",
    },
    {
      title: "Đã bán ",
      dataIndex: "sold_out",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={record.images}
          alt=""
          srcset=""
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (dataReceipt && dataReceipt.length > 0) {
    dataTable = dataReceipt.map((item, index) => {
      return {
        stt: index + 1,
        id: item._id,
        name: item?.product.name,
        originPrice: item.originPrice,
        quantity: item.quantity,
        product: item.product._id,
        images: item.product.images[0].url,
        sold_out: item.sold_out,
      };
    });
  }
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

  const handleDeleteReceipt = async () => {
    try {
      setShowModalDelete(false);
      setIsLoading(true);
      const res = await ReceiptService.deleteReceipt(idReceipt);
      setIsLoading(false);
      if (res.success) {
        fetchDataReceipt();
        toast.success("Xóa phiếu nhập kho thành công");
        setShowModalDelete(false);
      }
    } catch (e) {
      console.log(e);
      setShowModalDelete(false);
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setShowModalAdd(false);
    setShowModalEdit(false);
    setShowModalDelete(false);
  };
  const handleAddReceipt = async () => {
    if (
      !addReceipt.productId ||
      !addReceipt.originPrice ||
      !addReceipt.quantity
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
    } else {
      try {
        setShowModalAdd(false);
        setIsLoading(true);
        const res = await ReceiptService.creatReceipt(addReceipt);
        setIsLoading(false);
        if (res.success) {
          toast.success("Tạo phiếu nhập kho thành công");
          fetchDataReceipt();
        }
      } catch (e) {
        setIsLoading(false);

        console.log(e);
      }
    }
  };
  const handleEditReceipt = async () => {
    try {
      setShowModalEdit(false);
      setIsLoading(true);
      const res = await ReceiptService.updateReceipt(idReceipt, editReceipt);
      setIsLoading(false);
      if (res.success) {
        fetchDataReceipt();
        toast.success("Cập nhật kho thành công");
        setShowModalEdit(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      setShowModalEdit(false);
    }
  };
  return (
    <div className="w-full flex flex-col">
      <div className=" flex  m-2 md:justify-between">
        <span
          className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-red-500  text-white cursor-pointer"
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
        title="Thêm phiếu nhập kho"
        open={showModalAdd}
        onOk={handleAddReceipt}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
        cancelButtonProps={{ style: { display: "none" } }}
        width={800}
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Sản phẩm</p>
          <select
            value={addReceipt.productId}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddReceipt({ ...addReceipt, productId: e.target.value })
            }
          >
            {data && data.length > 0
              ? data.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))
              : null}
          </select>
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá nhập</p>
          <input
            type="text"
            value={addReceipt.originPrice}
            placeholder="Giá nhập sản phẩm"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddReceipt({ ...addReceipt, originPrice: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Số lượng</p>
          <input
            type="text"
            value={addReceipt.quantity}
            placeholder="Số lượng đã nhập"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setAddReceipt({ ...addReceipt, quantity: e.target.value })
            }
          />
        </label>
      </Modal>
      <Modal
        title="Chỉnh sửa sản phẩm"
        open={showModalEdit}
        onOk={handleEditReceipt}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
        cancelButtonProps={{ style: { display: "none" } }}
        width={800}
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá nhập</p>
          <input
            type="text"
            value={editReceipt.originPrice}
            placeholder="Giá nhập sản phẩm"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditReceipt({ ...editReceipt, originPrice: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Số lượng</p>
          <input
            type="text"
            value={editReceipt.quantity}
            placeholder="Số lượng đã nhập"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditReceipt({ ...editReceipt, quantity: e.target.value })
            }
          />
        </label>
      </Modal>
      <Modal
        title="Xóa phiếu nhập kho"
        open={showModalDelete}
        onOk={handleDeleteReceipt}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
        cancelButtonProps={{ style: { display: "none" } }}
        width={800}
      >
        <label className="flex justify-between items-center">
          <p className="w-full font-[500]">
            Bạn có chắc xóa phiếu nhập kho này?
          </p>
        </label>
      </Modal>
    </div>
  );
}

export default memo(AdminReceipt);
