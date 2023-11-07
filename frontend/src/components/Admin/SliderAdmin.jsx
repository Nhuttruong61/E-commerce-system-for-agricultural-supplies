import React, { memo, useEffect, useState } from "react";
import TableComponent from "../Table";
import { Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { AiOutlineCloudUpload } from "react-icons/ai";
import imageCompression from "browser-image-compression";
import * as SliderService from "../../service/sliderService";
import { toast } from "react-toastify";
import { handleOnchangeImage } from "../../until";

function SliderAdmin() {
  const [dataSlider, setDataSlider] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idSlider, setIdSlider] = useState("");
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editSlider, setEditSlider] = useState({
    images: "",
  });

  const getDataSlider = async () => {
    const res = await SliderService.getAllSlider();
    if (res.success) {
      setDataSlider(res.slider);
    }
  };
  useEffect(() => {
    getDataSlider();
  }, []);

  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1"
          onClick={() => {
            setShowModalEdit(true);
            setIdSlider(item._id);
            setEditSlider({
              images: item.images[0].url,
            });
          }}
        >
          <EditOutlined className="text-green-600 border border-[green] py-2 px-1 rounded-[4px]" />
        </div>
        <div
          className="mx-1"
          onClick={() => {
            setShowModalDelete(true);
            setIdSlider(item._id);
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
      dataIndex: "sst",
    },

    {
      title: "Ảnh",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={record.images[0].url}
          alt="Product"
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
  if (dataSlider && dataSlider.length > 0) {
    dataTable = dataSlider.map((item, index) => {
      return {
        key: item._id,
        sst: index + 1,
        ...item,
      };
    });
  }
  const handleCancel = () => {
    setShowModalAdd(false);
    setShowModalDelete(false);
    setShowModalEdit(false);
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
  const addSliderImage = async () => {
    try {
      setIsLoading(true);
      setShowModalAdd(false);
      const res = await SliderService.createSlider({ images: selectedImage });
      setIsLoading(false);
      if (res.success) {
        toast.success("Thêm ảnh thành công");
        getDataSlider();
        setSelectedImage(null);
      }
    } catch (e) {
      console.log(e);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      setShowModalDelete(false);
      setIsLoading(true);
      const res = await SliderService.deleteSlider(idSlider);
      setIsLoading(false);
      if (res.success) {
        toast.success("Xóa ảnh thành công");
        getDataSlider();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedImage) {
      setEditSlider({
        images: selectedImage,
      });
    }
  }, [selectedImage]);
  const handleEdit = async () => {
    try {
      setShowModalEdit(false);
      setIsLoading(true);
      const res = await SliderService.updateSlider(idSlider, editSlider);
      setIsLoading(false);
      if (res.success) {
        getDataSlider();
        toast.success("Cập nhật ảnh thành công");
      }
    } catch (e) {
      toast.error("Đã xãy ra lỗi");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
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
        title="Thêm ảnh slider"
        open={showModalAdd}
        onOk={addSliderImage}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
      >
        <label className="flex items-center my-8 w-[30%] ">
          <label
            htmlFor="inport"
            className="bg-[#0e9c49] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2 px-2"
          >
            Ảnh
          </label>
          <input
            id="inport"
            type="file"
            hidden
            onChange={(e) => handleOnchangeImage(e, setSelectedImage)}
          />
          {selectedImage ? (
            <img
              className="w-[40px] h-[40px] object-cover rounded-full"
              src={selectedImage}
              alt=""
              value={selectedImage}
            />
          ) : null}
        </label>
      </Modal>
      <Modal
        title="Xóa ảnh"
        open={showModalDelete}
        onOk={handleDelete}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Bạn có muốn chắc xóa ảnh này?`} </p>
      </Modal>
      <Modal
        title="Chỉnh sửa ảnh"
        open={showModalEdit}
        onOk={handleEdit}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
      >
        <label className="flex items-center my-8 w-[30%] ">
          <label
            htmlFor="inport"
            className="bg-[#0e9c49] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2 px-2"
          >
            Ảnh
          </label>
          <input
            id="inport"
            type="file"
            hidden
            onChange={(e) => handleOnchangeImage(e, setSelectedImage)}
          />
          {selectedImage ? (
            <img
              className="w-[40px] h-[40px] object-cover "
              src={selectedImage}
              alt=""
            />
          ) : (
            <img className="w-[50px] h-[50px]" src={editSlider.images} alt="" />
          )}
        </label>
      </Modal>
    </div>
  );
}

export default memo(SliderAdmin);
