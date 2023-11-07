import React, { memo, useEffect, useRef, useState } from "react";
import TableComponent from "../../Table";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Space } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import imageCompression from "browser-image-compression";
import * as ProductService from "../../../service/productService";
import { toast } from "react-toastify";
import { getAllProductRd } from "../../../redux/action/productAction";
import { CSVLink } from "react-csv";
import { CiExport } from "react-icons/ci";
import { handleOnchangeImage } from "../../../until";

function ProductAboutToExpire() {
  const { data } = useSelector((state) => state.category);
  const product = useSelector((state) => state.product);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState(data.categories[0]._id);
  const [isLoading, setIsLoading] = useState(false);
  const [editProduct, setEditProduct] = useState({
    _id: "",
    name: "",
    description: [],
    category,
    weight: "",
    originPrice: "",
    price: "",
    distCount: "",
    quantity: "",
    origin: "",
    expirationDate: null,
    newImage: "",
  });
  const [idProduct, setIdProduct] = useState();
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
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1"
          onClick={() => {
            setShowModalDelete(true);
            setIdProduct(item._id);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
        </div>
        <div
          className="mx-1"
          onClick={() => {
            setShowModalEdit(true);
            setIdProduct(item._id);
            setEditProduct({
              _id: item._id,
              name: item.name,
              description: item.description,
              category: item.category.categoryid,
              weight: item.weight,
              originPrice: item.originPrice,
              price: item.price,
              distCount: item.distCount,
              quantity: item.quantity,
              origin: item.origin,
              expirationDate: item.expirationDate,
              images: item.images[0].url,
              newImage: item.images[0].url,
            });
          }}
        >
          <EditOutlined className="text-green-600 border border-[green] py-2 px-1 rounded-[4px]" />
        </div>
      </div>
    );
  };
  const renderInfor = (text, item) => {
    return (
      <div
        className="cursor-pointer"
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
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
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

  let dataCategory = [];
  if (data && data.categories) {
    dataCategory = data.categories.map((item) => {
      return {
        ...item,
      };
    });
  }

  const okButtonEdit = {
    style: {
      color: "blue",
      border: "1px solid #ccc",
    },
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };

  const handleCancel = () => {
    setShowModalEdit(false);
    setShowModalDelete(false);
    setSelectedImage(null);
  };
  useEffect(() => {
    if (selectedImage) {
      setEditProduct((prevEditProduct) => ({
        ...prevEditProduct,
        newImage: selectedImage,
      }));
    } else {
      setEditProduct((prevEditProduct) => ({
        ...prevEditProduct,
        newImage: prevEditProduct.newImage,
      }));
    }
  }, [selectedImage]);

  const handleEditProduct = async () => {
    setShowModalEdit(false);
    setIsLoading(true);
    const res = await ProductService.updateProduct(editProduct, idProduct);
    setIsLoading(false);
    if (res.success) {
      dispatch(getAllProductRd());
      toast.success("Cập nhật sản phẩm thành công");
    }
  };
  const handleDelete = async () => {
    setIsLoading(true);
    const res = await ProductService.deleteProduct(idProduct);
    setShowModalDelete(false);
    if (res.success) {
      dispatch(getAllProductRd());
      toast.success("Xóa sản phẩm thành công");
    }
    setIsLoading(false);
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
  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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
          <h2 className="font-[600] px-1">Export</h2>
        </CSVLink>
      </div>

      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Cập nhật sản phẩm"
        open={showModalEdit}
        onOk={handleEditProduct}
        onCancel={handleCancel}
        okButtonProps={okButtonEdit}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tên</p>
          <input
            value={editProduct.name}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
          />
        </label>
        <label className="flex justify-center items-center">
          <p className="w-[20%] font-[500]">Mô tả</p>
          <textarea
            value={editProduct.description.join("\n")}
            className="w-[80%] md:px-4 h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                description: e.target.value.split("\n"),
              })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Loại</p>
          <select
            value={editProduct.category._id}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, category: e.target.value })
            }
          >
            {dataCategory && dataCategory.length > 0
              ? dataCategory.map((item) => {
                  return (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  );
                })
              : null}
          </select>
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Trọng lượng</p>
          <input
            value={editProduct.weight}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, weight: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá nhập</p>
          <input
            value={editProduct.price}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá bán</p>
          <input
            value={editProduct.originPrice}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, originPrice: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giảm giá</p>
          <input
            value={editProduct.distCount}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, distCount: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Số lượng</p>
          <input
            value={editProduct.quantity}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, quantity: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Xuất xứ</p>
          <input
            value={editProduct.origin}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, origin: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Ngày hết hạn</p>
          <input
            type="date"
            value={formatDateForInput(editProduct.expirationDate)}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, expirationDate: e.target.value })
            }
          />
        </label>
        <label className="flex items-center my-8 w-[30%] ">
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
            onChange={(e) => handleOnchangeImage(e, setSelectedImage)}
          />
          {selectedImage ? (
            <img
              className="w-[40px] h-[40px] object-cover "
              src={selectedImage}
              alt=""
            />
          ) : (
            <img
              className="w-[50px] h-[50px]"
              src={editProduct.images}
              alt=""
            />
          )}
        </label>
      </Modal>
      <Modal
        title="Xóa sản phẩm"
        open={showModalDelete}
        onOk={handleDelete}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Bạn có muốn chăc xóa sản phảm này?`} </p>
      </Modal>
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
              <p className=" font-[500] w-[30%] py-1">Mô tả:</p>
              <div className="pl-2 py-2">
                {inforProduct?.description.length > 0
                  ? inforProduct.description.map((item, index) => {
                      return <p key={index}>{item}</p>;
                    })
                  : null}
              </div>
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
              <p className="pl-2">{inforProduct?.expirationDate}</p>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(ProductAboutToExpire);
