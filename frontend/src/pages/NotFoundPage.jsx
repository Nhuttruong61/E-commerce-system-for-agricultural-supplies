import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-semibold text-red-500 mb-4">
        404 - Không Tìm Thấy Trang
      </h1>
      <p className="text-lg text-gray-600 mb-2">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
      </p>
      <p className="text-lg text-gray-600 mb-4">
        Hãy quay lại trang chủ hoặc kiểm tra lại URL của bạn.
      </p>
      <Link to="/" className="text-white bg-black px-2 py-1 rounded-[4px] hover:bg-slate-800">
        Trang chủ
      </Link>
    </div>
  );
}

export default NotFoundPage;
