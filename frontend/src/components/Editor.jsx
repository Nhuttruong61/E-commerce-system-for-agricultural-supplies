import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function Editor({ value, setValue }) {
  return (
    <ReactQuill
      className="h-[30vh]"
      theme="snow"
      value={value}
      onChange={setValue}
    />
  );
}

export default Editor;
