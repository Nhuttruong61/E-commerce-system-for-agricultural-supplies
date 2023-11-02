import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function Editor({ value, setValue }) {
  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: ["black", "red"] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];
  const module = {
    toolbar: toolbarOptions,
  };
  return (
    <ReactQuill
      className="h-[30vh]"
      theme="snow"
      value={value}
      onChange={setValue}
      modules={module}
    />
  );
}

export default Editor;
