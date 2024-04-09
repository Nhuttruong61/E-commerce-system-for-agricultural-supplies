import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function Editor({ value, setValue }) {
  var toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],

    [{ color: ["black", "red"] }, { background: [] }],

    ["clean"],
  ];
  const module = {
    toolbar: toolbarOptions,
  };
  return (
    <ReactQuill
      className="h-[50vh] "
      theme="snow"
      value={value}
      onChange={setValue}
      modules={module}
    />
  );
}

export default Editor;
