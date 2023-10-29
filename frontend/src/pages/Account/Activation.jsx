import React, { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Userservice from "../../service/userService";
function Activation() {
  const { accessToken } = useParams();
  const [error, setError] = useState(false);
  useEffect(() => {
    const ActivetionToken = async () => {
      try {
        const res = await Userservice.Activation_token(accessToken);
        setError(false);
      } catch (e) {
        setError(true);
      }
    };
    ActivetionToken();
  }, []);
  const mesage = error
    ? "Xác nhận thất bại vui lòng kiểm tra lại!"
    : "Xác nhận thành công !";
  return (
    <div className="flex justify-center h-screen items-center">
      <p>{mesage}</p>
    </div>
  );
}

export default memo(Activation);
