import React, { memo, useState } from "react";
import { toast } from "react-toastify";
import * as BlogService from "../../../service/blogService.js";
import { handleOnchangeImage } from "../../../until.js";
import Editor from "../../Input/Editor.jsx";
function CreateBlog() {
  const [title, setTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [content, setContent] = useState(null);

  const handleCreateBlog = async () => {
    if (title === "" || content.length === 0) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
    } else {
      const blog = {
        title: title,
        content: content,
        selectedImage: selectedImage,
      };
      console.log(blog);
      try {
        const res = await BlogService.createBlog(blog);
        if (res.success) {
          setTitle("");
          setContent(null);
          setSelectedImage(null);
          toast.success("Tạo tin tức thành công");
        }
      } catch (e) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
      }
    }
  };
  return (
    <div className="flex  items-center w-full flex-col ">
      <h1 className="md:text-[2.6rem] text-[2rem] font-[600]">Thêm bài viết</h1>
      <div className=" w-[90%]">
        <label htmlFor="" className="flex justify-between items-center">
          <p className="w-[20%] font-[500] md:text-[100%] text-[80%]">
            Tiêu đề bài viết
          </p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
          />
        </label>
        <label htmlFor="" className="flex justify-between">
          <p className="w-[20%] font-[500] md:text-[100%] text-[80%]">
            Nội dung
          </p>

          <div className="w-[80%] h-[58vh]  my-1 py-2  sm:px-0  overflow-auto ">
            <Editor value={content} setValue={setContent} />
          </div>
        </label>
        <div className="w-full justify-end">
          <label className="flex justify-end my-4 ">
            <label
              htmlFor="inport"
              className="bg-[#0e9c49] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2 px-2 md:text-[100%] text-[80%]"
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
        </div>
      </div>

      <div className="my-2">
        <button
          className="py-1 px-2 bg-[#009B49] hover:bg-[#2B4706] rounded font-[600] text-white md:text-[100%] text-[80%]"
          onClick={handleCreateBlog}
        >
          Tạo tin tức
        </button>
      </div>
    </div>
  );
}

export default memo(CreateBlog);
