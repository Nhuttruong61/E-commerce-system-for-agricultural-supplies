import React, { memo } from "react";
function Input(props) {
  const { name, value, placeholder, type } = props;
  const handleOnchangeInput = (e) => {
    props.onChange(e.target.value);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 my-1">
        {name}
      </label>
      <input
        value={value}
        onChange={handleOnchangeInput}
        placeholder={placeholder}
        type={type}
        minLength={4}
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      ></input>
    </div>
  );
}

export default memo(Input);
