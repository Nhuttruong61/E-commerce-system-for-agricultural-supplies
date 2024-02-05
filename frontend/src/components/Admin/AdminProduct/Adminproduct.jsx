import React, { memo, useEffect, useRef, useState } from "react";
import TableComponent from "../../common/Table";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Space } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { AiOutlineCloudUpload } from "react-icons/ai";
import * as ProductService from "../../../service/productService";
import { toast } from "react-toastify";
import { getAllProductRd } from "../../../redux/action/productAction";
import { CSVLink } from "react-csv";
import { CiExport } from "react-icons/ci";
import Editor from "../../Input/Editor";
import { handleOnchangeImage } from "../../../until";
import moment from "moment";
import { getAReceipt, getAllReceipt } from "../../../service/receiptService";
function Adminproduct() {
  const { data } = useSelector((state) => state.category);
  const product = useSelector((state) => state.product);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState([]);
  const [category, setCategory] = useState(data.categories[0]._id);
  const [isLoading, setIsLoading] = useState(false);
  const [editProduct, setEditProduct] = useState({
    _id: "",
    name: "",
    description: [],
    category,
    weight: "",
    receipt: "",
    capacity: "",
    originPrice: "",
    price: "",
    wholesalePrice: "",
    distCount: "",
    gifts: [],
    quantity: "",
    origin: "",
    expirationDate: null,
    images: "",
  });
  const [idProduct, setIdProduct] = useState();
  const [dataExport, setDataExport] = useState([]);
  const [showModalInfo, setShowModalInfor] = useState(false);
  const [inforProduct, setInfoUProduct] = useState(null);
  const [isShowGift, setIsShowGift] = useState(false);
  const [dataReceipt, setDataReceipt] = useState(null);
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
          className="mx-1 cursor-pointer"
          onClick={() => {
            setShowModalDelete(true);
            setIdProduct(item._id);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
        </div>
        <div
          className="mx-1 cursor-pointer"
          onClick={() => {
            setIdProduct(item._id);
            item?.gifts?.length > 0
              ? setIsShowGift(true)
              : setIsShowGift(false);
            setShowModalEdit(true);
            setEditProduct({
              _id: item._id,
              name: item.name,
              description: item.description,
              category: item.category.categoryid,
              weight: item.weight,
              capacity: item.capacity,
              originPrice: item.originPrice,
              price: item.price,
              receipt: item.receipt ? item.receipt : "",
              wholesalePrice: item.wholesalePrice,
              distCount: item.distCount,
              gifts: item.gifts,
              quantity: item.quantity,
              origin: item.origin,
              expirationDate: item.expirationDate,
              images: item.images[0].url,
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
      ...getColumnSearchProps("categoryName"),
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={record.images[0].url}
          alt="Product"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
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
  let dataTable = [];
  if (product?.data && product.data.length > 0) {
    dataTable = product.data.map((item, index) => {
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
  const handleOnchangeCategory = (e) => {
    setCategory(e.target.value);
  };
  const handleAddProduct = async () => {
    try {
      if (!name || !description || !category) {
        toast.warning("Xin nhập đầy đủ thông tin");
      } else {
        setShowModalAdd(false);
        setIsLoading(true);
        const product = {
          name,
          description,
          category: {
            _id: category,
          },
          images: selectedImage,
        };
        const res = await ProductService.createProduct(product);
        if (res.success) {
          toast.success("Thêm sản phẩm thành công");
          dispatch(getAllProductRd());
          setName("");
          setDescription([]);
          setSelectedImage(null);
        } else {
          toast.error("Đã xảy ra lỗi");
        }
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      toast.error("Đã xảy ra lỗi");
    }
  };
  const okButtonAdd = {
    style: {
      color: "green",
      border: "1px solid #ccc",
    },
  };
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
    setShowModalAdd(false);
    setShowModalEdit(false);
    setShowModalDelete(false);
    setSelectedImage(null);
    setSelectedImage(null);
  };
  useEffect(() => {
    if (selectedImage && !selectedImage.includes("cloudinary")) {
      setEditProduct({
        ...editProduct,
        images: selectedImage,
      });
    }
  }, [selectedImage]);
  const handleEditProduct = async () => {
    if (
      !editProduct.receipt ||
      !editProduct.weight ||
      !editProduct.expirationDate
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
    } else if (
      editProduct.expirationDate < moment(new Date()).format("YYYY-MM-DD")
    ) {
      toast.warning("Ngày hết hạn không hợp lệ");
    } else {
      try {
        setShowModalEdit(false);
        setIsLoading(true);
        const res = await ProductService.updateProduct(editProduct, idProduct);
        setIsLoading(false);
        if (res.success) {
          dispatch(getAllProductRd());
          toast.success("Cập nhật sản phẩm thành công");
        }
      } catch (e) {
        toast.error("Đã xảy ra lỗi");
        console.log(e);
      }
    }
  };
  const handleDelete = async () => {
    setShowModalDelete(false);
    try {
      setIsLoading(true);
      const res = await ProductService.deleteProduct(idProduct);
      if (res.success) {
        dispatch(getAllProductRd());
        toast.success("Xóa sản phẩm thành công");
      }
      setIsLoading(false);
    } catch (e) {
      toast.error("Đã xảy ra lỗi");
      console.log(e);
    }
  };
  const handleExportProducts = () => {
    let res = [];
    if (dataTable && dataTable.length > 0) {
      dataTable.forEach((item) => {
        let product = {
          id: item._id,
          Tên: item.name,
          Loại_sản_phẩm: item.categoryName,
          Giá_nhập: item.originPrice,
          Giá_bán: item.price,
          Giá_bán_sỉ: item.wholesalePrice,
          Số_lượng_còn_lại: item.quantity,
          Đã_bán: item.sold_out,
          HSD: item.expirationDate,
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
  useEffect(() => {
    if (isShowGift === false) {
      setEditProduct({
        ...editProduct,
        gifts: [],
      });
    }
  }, [isShowGift]);
  const fetchDataReceipt = async () => {
    try {
      const res = await getAllReceipt();
      if (res.success) {
        setDataReceipt(res.receipt);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchDataReceipt();
  }, []);
  const findReceipt = async () => {
    const id = editProduct?.receipt;
    try {
      const res = await getAReceipt(id);
      if (res.success) {
        setEditProduct({
          ...editProduct,
          originPrice: res.receipt.originPrice,
          quantity: res.receipt.quantity,
        });
      }
    } catch (e) {
      console.log(e);
      setEditProduct({
        ...editProduct,
        receipt: "",
        originPrice: 0,
        quantity: 0,
      });
    }
  };
  useEffect(() => {
    if (editProduct.receipt !== "" && editProduct.receipt !== undefined) {
      findReceipt();
    }
  }, [editProduct.receipt]);

  const handleOnchangeEditCheckbox = (item) => (e) => {
    const isChecked = e.target.checked;
    setEditProduct((pre) => {
      const updatedGifts = isChecked
        ? [...pre.gifts, item._id]
        : pre.gifts.filter((id) => id !== item._id);
      return { ...pre, gifts: updatedGifts };
    });
  };
  return (
    <div className="w-full flex flex-col">
      <div className="flex  m-2 md:justify-between">
        <span
          className="border-[2px] flex justify-center rounded cursor-pointer items-center px-2 py-1 bg-red-500  text-white"
          onClick={() => setShowModalAdd(true)}
        >
          <AiOutlineCloudUpload className="md:text-[30px] text-[20px]" />
          <h2 className="font-[600] px-1 ">Tạo mới</h2>
        </span>
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

      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Thêm mới sản phẩm"
        open={showModalAdd}
        onOk={handleAddProduct}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
        width={800}
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tên</p>
          <input
            value={name}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên sản phảm"
          />
        </label>
        <label className="flex justify-center items-center pb-10">
          <p className="w-[20%] font-[500]">Mô tả</p>
          <div className="w-[80%]  h-auto my-1  sm:px-0 ">
            <Editor value={description} setValue={setDescription} />
          </div>
        </label>
        <label className="flex justify-between items-center mt-10">
          <p className="w-[20%] font-[500]">Loại</p>
          <select
            value={category}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={handleOnchangeCategory}
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
              className="w-[100px] h-[100px] object-contain "
              src={selectedImage}
              alt=""
              value={selectedImage}
            />
          ) : null}
        </label>
      </Modal>
      <Modal
        title="Cập nhật sản phẩm"
        open={showModalEdit}
        onOk={handleEditProduct}
        onCancel={handleCancel}
        okButtonProps={okButtonEdit}
        okType="none"
        width={800}
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
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Phiếu nhập</p>
          <select
            className="w-[80%] md:px-4 h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            value={editProduct.receipt || ""}
            required={editProduct.receipt === ""}
            onChange={(e) =>
              setEditProduct({ ...editProduct, receipt: e.target.value })
            }
          >
            {!editProduct.receipt && (
              <option value="" disabled>
                Lựa phiếu nhập
              </option>
            )}
            {dataReceipt &&
              dataReceipt
                ?.filter((el) => el.product._id === idProduct)
                .map((el) => (
                  <option value={el._id} key={el._id}>
                    {el._id}
                  </option>
                ))}
          </select>
        </label>

        <label className="flex justify-center items-center ">
          <p className="w-[20%] font-[500]">Mô tả</p>
          <div className="w-[80%]  h-auto my-1  sm:px-0 ">
            <Editor
              value={editProduct.description.join("\n")}
              setValue={(value) =>
                setEditProduct({
                  ...editProduct,
                  description: value.split("\n"),
                })
              }
            />
          </div>
        </label>
        <label className="flex justify-between items-center mt-16">
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
          <p className="w-[20%] font-[500]">Dung tích</p>
          <input
            value={editProduct.capacity}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, capacity: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá nhập</p>
          <input
            readOnly
            value={editProduct.originPrice}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
            onChange={(e) =>
              setEditProduct({ ...editProduct, originPrice: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá bán</p>
          <input
            value={editProduct.price}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá bán sỉ</p>
          <input
            value={editProduct.wholesalePrice}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, wholesalePrice: e.target.value })
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
            readOnly
            value={editProduct.quantity}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
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
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tặng kèm</p>
          <input
            type="checkbox"
            checked={isShowGift}
            onClick={() => setIsShowGift(!isShowGift)}
          />
        </label>
        {isShowGift && (
          <label className="flex justify-between items-center">
            <p className="w-[20%] font-[500]">Quà tặng</p>
            <div className="w-[80%] md:px-4  h-[12vh] overflow-y-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]">
              {product?.data
                ?.filter(
                  (el) =>
                    el._id !== idProduct && el.quantity >= editProduct.quantity
                )
                .map((item) => {
                  return (
                    <div key={item._id} className="flex ">
                      <input
                        type="checkbox"
                        checked={editProduct?.gifts?.includes(item._id)}
                        onChange={handleOnchangeEditCheckbox(item)}
                      />
                      <p className="px-2">{item?.name}</p>
                    </div>
                  );
                })}
            </div>
          </label>
        )}
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
              className="w-[100px] h-[100px] object-contain "
              src={selectedImage}
              alt=""
            />
          ) : (
            <img
              className="w-[100px] h-[100px] object-contain"
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
        width={800}
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
            <label className="flex items-center ">
              <p className=" font-[500] w-[30%] py-1">Loại:</p>
              <p className="pl-2">{inforProduct?.category?.name}</p>
            </label>

            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Giảm giá:</p>
              <p className="pl-2">{inforProduct?.distCount}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Giá nhập:</p>
              <p className="pl-2">
                {inforProduct?.originPrice.toLocaleString()} đ
              </p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Giá bán:</p>
              <p className="pl-2">{inforProduct?.price.toLocaleString()} đ</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Giá bán sỉ:</p>
              <p className="pl-2">
                {inforProduct?.wholesalePrice.toLocaleString()} đ
              </p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[30%] py-1">Trọng lượng:</p>
              <p className="pl-2">{inforProduct?.weight} kg</p>
            </label>
            {inforProduct?.capacity && (
              <label className="flex items-center">
                <p className=" font-[500] w-[30%] py-1">Dung tích:</p>
                <p className="pl-2">{inforProduct?.capacity} lít</p>
              </label>
            )}
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

export default memo(Adminproduct);
