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
import { AiOutlineCloudUpload } from "react-icons/ai";
import imageCompression from "browser-image-compression";
import * as ProductService from "../../../service/productService";
import { toast } from "react-toastify";
import { getAllProductRd } from "../../../redux/action/productAction";
import { CSVLink } from "react-csv";
import { CiExport } from "react-icons/ci";
import Editor from "../../Editor";
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
  const [price, setPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [originPrice, setOriginPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [capacity, setCapacity] = useState("");
  const [origin, setOrigin] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [distCount, setdistCount] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editProduct, setEditProduct] = useState({
    _id: "",
    name: "",
    description: [],
    category,
    weight: "",
    capacity: "",
    originPrice: "",
    price: "",
    wholesalePrice: "",
    distCount: "",
    gifts: [],
    quantity: "",
    origin: "",
    expirationDate: null,
    newImage: "",
  });
  const [idProduct, setIdProduct] = useState();
  const [dataExport, setDataExport] = useState([]);
  const [showModalInfo, setShowModalInfor] = useState(false);
  const [inforProduct, setInfoUProduct] = useState(null);
  const [isShowGift, setIsShowGift] = useState(false);
  const [gifts, setGifts] = useState([]);
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
              wholesalePrice: item.wholesalePrice,
              distCount: item.distCount,
              gifts: item.gifts,
              quantity: item.quantity,
              origin: item.origin,
              expirationDate: item.expirationDate,
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
    // {
    //   title: "Mã sản phẩm",
    //   dataIndex: "id",
    // },
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
  const handleOnchangeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };
  const handleOnchangeCategory = (e) => {
    setCategory(e.target.value);
  };
  const handleAddProduct = async () => {
    try {
      if (
        !name ||
        !description ||
        !category ||
        !originPrice ||
        !quantity ||
        !wholesalePrice
      ) {
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
          weight,
          capacity: capacity !== "" ? capacity : null,
          originPrice,
          price,
          wholesalePrice,
          distCount,
          gifts: isShowGift ? gifts : null,
          quantity,
          origin,
          expirationDate,
          images: selectedImage,
        };
        const res = await ProductService.createProduct(product);
        if (res.success) {
          toast.success("Thêm sản phẩm thành công");
          dispatch(getAllProductRd());
          setName("");
          setWeight("");
          setCapacity("");
          setOrigin("");
          setExpirationDate("");
          setDescription([]);
          setOriginPrice("");
          setPrice("");
          setWholesalePrice("");
          setQuantity("");
          setSelectedImage(null);
        } else {
          toast.error("Đã xảy ra lỗi");
        }
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
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
    if (selectedImage) {
      setEditProduct({
        ...editProduct,
        newImage: selectedImage,
      });
    }
  }, [selectedImage]);

  const handleEditProduct = async () => {
    setShowModalEdit(false);
    try {
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
  useEffect(() => {
    if (isShowGift === false) {
      setGifts([]);
      setEditProduct({
        ...editProduct,
        gifts: [],
      });
    }
  }, [isShowGift]);
  const handleOnchangeCheckbox = (item) => (e) => {
    const productId = item._id;
    if (e.target.checked) {
      setGifts((prev) => [...prev, productId]);
    } else {
      setGifts((prev) => prev.filter((id) => id !== productId));
    }
  };
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
      <div className="flex  md:flex-row m-2 justify-between">
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
          <h2 className="font-[600] px-1">Export</h2>
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
        <label className="flex justify-between items-center">
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
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Trọng lượng</p>
          <input
            value={weight}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Nhập trọng lượng đơn vị kg"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Dung tích</p>
          <input
            value={capacity}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Nhập dung tích đơn vị lít"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá nhập</p>
          <input
            value={originPrice}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setOriginPrice(e.target.value)}
            placeholder="Nhập số giá nhập trên món"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá bán</p>
          <input
            value={price}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Nhâp giá bán trên món"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giá bán sỉ</p>
          <input
            value={wholesalePrice}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setWholesalePrice(e.target.value)}
            placeholder="Nhâp giá bán sỉ trên món"
          />
        </label>

        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giảm giá</p>
          <input
            value={distCount}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setdistCount(e.target.value)}
            placeholder="Phầm trăm giảm giá"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Số lượng</p>
          <input
            value={quantity}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Số lượng sản phẩm"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Xuất xứ</p>
          <input
            value={origin}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Xuất xứ sản phẩm"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Ngày hết hạn</p>
          <input
            type="date"
            value={expirationDate}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setExpirationDate(e.target.value)}
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
              {product?.data?.map((item) => {
                return (
                  <div key={item._id} className="flex ">
                    <input
                      type="checkbox"
                      checked={gifts?.includes(item._id)}
                      onChange={handleOnchangeCheckbox(item)}
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
            onChange={handleOnchangeImage}
          />
          {selectedImage ? (
            <img
              className="w-[40px] h-[40px] object-cover rounded-full"
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
            value={editProduct.originPrice}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
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
              {product?.data?.map((item) => {
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
            onChange={handleOnchangeImage}
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
              src={editProduct.newImage}
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
            <label className="flex items-center mt-16">
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
              <p className="pl-2">{inforProduct?.expirationDate}</p>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(Adminproduct);
