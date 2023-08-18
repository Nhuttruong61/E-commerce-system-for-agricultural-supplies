import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Đã chỉnh sửa thành BrowserRouter và thêm React
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import routers from "./router";

function App() {
  return (
    <div className="App">
      <Router>
        {" "}
        {/* Đã chỉnh sửa thành Router */}
        <Routes>
          {routers.map((route) => {
            const Page = route.page;
            const isShowHeader = route.isShowHeader;
            // const Layout = route.isShowHeader ? DefaultComponent : Fragment; // Đã loại bỏ, không cần thiết

            return (
              <Route
                key={route.path}
                path={route.path} // Đã chỉnh sửa thành route.path
                element={
                  // <Layout> // Đã loại bỏ, không cần thiết
                  <Page />
                  // </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </div>
  );
}

export default App;
