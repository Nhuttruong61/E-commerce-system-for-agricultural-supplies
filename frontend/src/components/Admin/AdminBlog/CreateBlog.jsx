import React, { memo, useState } from "react";
import imageCompression from "browser-image-compression";
import { Modal } from "antd";
import { toast } from "react-toastify";
import * as BlogService from "../../../service/blogService.js";
import Loading from "../../Loading";
function CreateBlog() {
  const [title, setTitle] = useState("");
  const [titleContent, setTitleContent] = useState("");
  const [showModalReviewBlog, setShowModalReviewBlog] = useState(false);
  const [descriptionContent, setDescriptionContent] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleDescriptionChange = (e) => {
    setDescriptionContent(
      e.target.value.split("\n").filter((line) => line.trim() !== "")
    );
  };
  const handleOnchangeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Lỗi khi nén ảnh:", error);
    }
  };
  const handleAddContent = () => {
    const newContent = {
      heading: titleContent,
      description: descriptionContent,
      images: selectedImage,
    };
    setContent([...content, newContent]);

    setTitleContent("");
    setDescriptionContent([]);
    setSelectedImage(null);
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };

  const handleReviewblog = () => {
    setShowModalReviewBlog(false);
  };
  const handleCancel = () => {
    setShowModalReviewBlog(false);
  };
  const handleResetContent = () => {
    setTitleContent("");
    setDescriptionContent([]);
    setTitle("");
    setContent([]);
    setSelectedImage(null);
  };

  const handleCreateBlog = async () => {
    if (title === "" || content.length === 0) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
    } else {
      const blog = {
        title: title,
        content: content,
      };
      setIsLoading(true);
      try {
        const res = await BlogService.createBlog(blog);
        if (res.success) {
          setTitleContent("");
          setDescriptionContent([]);
          setTitle("");
          setContent([]);
          setSelectedImage(null);
          toast.success("Tạo tin tức thành công");
        }
        setIsLoading(false);
      } catch (e) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
      }
    }
  };
  return (
    <div className="flex  items-center w-full flex-col ">
      <h1 className="text-[2.6rem] font-[600]">Thêm tin tức mới</h1>
      <div className=" w-[90%]">
        <label htmlFor="" className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tiêu đề bài viết</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
          />
        </label>
        <label htmlFor="" className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Nội dung</p>
          <div className="w-[80%] md:px-4  h-[52vh] my-1 py-2 border-[2px] sm:px-0 rounded-[4px] overflow-auto ">
            <label htmlFor="" className="flex justify-between items-center">
              <p className="w-[20%] font-[500]">Tiêu đề nội dung</p>
              <input
                value={titleContent}
                onChange={(e) => setTitleContent(e.target.value)}
                className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
              />
            </label>
            <label htmlFor="" className="flex justify-between items-center">
              <p className="w-[20%] font-[500]">Mô tả nội dung</p>
              <textarea
                className="w-[80%] md:px-4 my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
                rows={5}
                value={descriptionContent.join("\n")}
                onChange={handleDescriptionChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setDescriptionContent([...descriptionContent, ""]);
                  }
                }}
              />
            </label>
            <label className="flex items-center my-4 w-[30%] ">
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
                onChange={handleOnchangeImage}
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
            <div className="w-full justify-end flex">
              <button
                className="px-2 py-1 bg-[#009B49] hover:bg-[#2B4706] rounded text-white"
                onClick={handleAddContent}
              >
                Thêm nội dung
              </button>
            </div>
          </div>
        </label>
      </div>
      <div className="flex w-[90%] justify-between">
        <p
          className="underline text-blue-600 cursor-pointer ml-[20%]"
          onClick={() => setShowModalReviewBlog(true)}
        >
          Xem lại nội dung
        </p>
        <p
          className="underline text-blue-600 cursor-pointer"
          onClick={handleResetContent}
        >
          Cài lại nội dung
        </p>
      </div>
      <div className="my-2">
        <button
          className="py-1 px-2 bg-[#009B49] hover:bg-[#2B4706] rounded font-[600] text-white"
          onClick={handleCreateBlog}
        >
          Tạo tin tức
        </button>
      </div>
      <Modal
        title="Xem lại"
        open={showModalReviewBlog}
        onOk={handleReviewblog}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
        width={800}
      >
        <label htmlFor="" className="flex justify-between items-center my-2">
          <p className="w-[20%] font-[500]">Tiêu đề bài viết</p>
          <input
            value={title}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
            readOnly
          />
        </label>
        <label
          htmlFor=""
          className="flex justify-between items-center h-[42vh]"
        >
          <p className="w-[20%] font-[500]">Nội dung</p>
          <div className="w-[80%] md:px-4  my-1 py-2 border-[2px] sm:px-0 rounded-[4px] h-[38vh] overflow-y-scroll ">
            {content &&
              content.length > 0 &&
              content.map((item, index) => {
                return (
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <p className="w-[20%] font-[500]">Tiêu đề {index + 1}</p>
                      <p className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] ">
                        {item?.heading}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="w-[20%] font-[500]">Nội dung {index + 1}</p>
                      {item.description &&
                        item.description.length > 0 &&
                        item.description.map((item) => {
                          return (
                            <div className="w-full">
                              <p className="w-[80%] md:px-4  h-auto my-1 py-2  sm:px-0  ">
                                {item}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                    {item?.images && (
                      <div className="flex justify-between items-center">
                        <p className="w-[20%] font-[500]">
                          Ảnh minh họa {index + 1}
                        </p>
                        <div className="w-[80%] md:px-4  h-auto my-1 py-2">
                          <img
                            src={item.images}
                            alt=""
                            className="w-[50px]- h-[50px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </label>
      </Modal>
    </div>
  );
}

export default memo(CreateBlog);
