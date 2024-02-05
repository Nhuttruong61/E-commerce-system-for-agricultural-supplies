import React, { memo, useEffect, useRef, useState } from "react";
import TableComponent from "../../common/Table";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Space } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { getAllProductRd } from "../../../redux/action/productAction";
import { CSVLink } from "react-csv";
import { CiExport } from "react-icons/ci";
import moment from "moment";

function ProductAboutToExpire() {
  const product = useSelector((state) => state.product);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataExport, setDataExport] = useState([]);
  const [showModalInfo, setShowModalInfor] = useState(false);
  const [inforProduct, setInfoUProduct] = useState(null);
  const dispatch = useDispatch();
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tải lại
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Thoát
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(function () {
          if (searchInput.current) {
            searchInput.current.select();
          }
        }, 100);
      }
    },
  });

  const renderInfor = (text, item) => {
    return (
      <div
        className="cursor-pointer "
        onClick={() => {
          setShowModalInfor(true);
          setInfoUProduct(item.inforProduct);
        }}
      >
        <EyeOutlined className="text-blue-600 border border-[blue] py-2 px-1 rounded-[4px]" />
      </div>
    );
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "categoryName",
    },
    {
      title: "Giá bán",
      dataIndex: "originPrice",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Đã bán",
      dataIndex: "sold_out",
      sorter: (a, b) => a.sold_out - b.sold_out,
    },
    {
      title: "Xen thêm",
      dataIndex: "review",
      render: renderInfor,
    },
  ];
  useEffect(() => {
    dispatch(getAllProductRd());
  }, []);

  const isExpirationDateWithin5Months = (expirationDate) => {
    const currentDate = new Date();
    const fiveMonthsFromNow = new Date();
    fiveMonthsFromNow.setMonth(currentDate.getMonth() + 5);

    return expirationDate > currentDate && expirationDate <= fiveMonthsFromNow;
  };

  let dataTable = [];
  if (product?.data && product.data.length > 0) {
    dataTable = product.data
      .filter((item) =>
        isExpirationDateWithin5Months(new Date(item.expirationDate))
      )
      .map((item, index) => {
        return {
          ...item,
          id: item._id,
          stt: index + 1,
          categoryName: item.category.categoryid.name,
          inforProduct: {
            ...item,
          },
        };
      });
  }

  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };

  const handleCancel = () => {
    setShowModalInfor(false);
  };

  const handleExportProducts = () => {
    let res = [];
    if (dataTable && dataTable.length > 0) {
      dataTable.forEach((item) => {
        let product = {
          _id: item._id,
          name: item.name,
          category: item.categoryName,
          weight: item.weight,
          createdAt: item.createdAt,
        };
        res.push(product);
      });
      setDataExport(res);
    }
  };

  const handleReviewProduct = () => {
    setShowModalInfor(false);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex  md:flex-row m-2 justify-between">
        <CSVLink
          filename="products.csv"
          className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-[#009b49]  text-white"
          data={dataExport}
          onClick={handleExportProducts}
        >
          <CiExport className="md:text-[30px] text-[20px] " />
          <h2 className="font-[600] px-1">Xuất File</h2>
        </CSVLink>
      </div>
      <p className="text-[#b3b1b1]">Sản phấm còn hạn sử dụng dưới 5 tháng</p>

      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Thông tin sản phẩm"
        open={showModalInfo}
        onOk={handleReviewProduct}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
        cancelButtonProps={{ style: { display: "none" } }}
        width={600}
      >
        <div className="flex items-center">
          <div className="w-[30%]">
            {inforProduct?.images ? (
              <img
                src={inforProduct.images[0].url}
                alt=""
                className="w-[80px] h-[80px]"
              />
            ) : null}
          </div>
          <div className="w-[70%]">
            <label className="flex  items-center">
              <p className=" font-[500] w-[30%] py-1">Tên:</p>
              <p className="pl-2">{inforProduct?.name}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Loại:</p>
              <p className="pl-2">{inforProduct?.category?.name}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Giảm giá:</p>
              <p className="pl-2">{inforProduct?.distCount}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Giá nhập:</p>
              <p className="pl-2">{inforProduct?.price.toLocaleString()} đ</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Giá bán:</p>
              <p className="pl-2">
                {inforProduct?.originPrice.toLocaleString()} đ
              </p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Trọng lượng:</p>
              <p className="pl-2">{inforProduct?.weight} kg</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Số lượng:</p>
              <p className="pl-2">{inforProduct?.quantity}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Đã bán:</p>
              <p className="pl-2">{inforProduct?.sold_out}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Ngày hết hạn:</p>
              <p className="pl-2">
                {moment(inforProduct?.expirationDate).format("YYYY-MM-DD")}
              </p>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(ProductAboutToExpire);
