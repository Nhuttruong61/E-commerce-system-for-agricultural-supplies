import React, { useEffect, useRef, useState } from "react";
import TableComponent from "../Table";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Space } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { AiOutlineCloudUpload, AiOutlineSend } from "react-icons/ai";
import imageCompression from "browser-image-compression";
import * as ProductService from "../../service/productService";
import { toast } from "react-toastify";
import { getAllProductRd } from "../../redux/action/productAction";
import { CSVLink } from "react-csv";
import { CiExport } from "react-icons/ci";
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
  const [newDescription, setNewDescription] = useState("");
  const [category, setCategory] = useState(data.categories[0]._id);
  const [tags, setTags] = useState("");
  const [originPrice, setOriginPrice] = useState("");
  const [distCount, setdistCount] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editProduct, setEditProduct] = useState({
    _id: "",
    name: "",
    description: [],
    category,
    tags: "",
    originPrice: "",
    distCount: "",
    quantity: "",
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
            console.log(item);
            setEditProduct({
              _id: item._id,
              name: item.name,
              description: item.description,
              category: item.category.categoryid,
              tags: item.tags,
              originPrice: item.originPrice,
              distCount: item.distCount,
              quantity: item.quantity,
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
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
    },
    {
      title: "Price",
      dataIndex: "originPrice",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Sold Out",
      dataIndex: "sold_out",
      sorter: (a, b) => a.sold_out - b.sold_out,
    },
    {
      title: "Info",
      dataIndex: "review",
      render: renderInfor,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  useEffect(() => {
    dispatch(getAllProductRd());
  }, []);
  let dataTable = [];
  if (product?.data && product.data.length > 0) {
    dataTable = product.data.map((item) => {
      return {
        ...item,
        id: item._id,
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
    if (!name || !description || !category || !originPrice || !quantity) {
      toast.warning("Please enter full product information");
    } else {
      setShowModalAdd(false);
      setIsLoading(true);
      const product = {
        name,
        description,
        category: {
          _id: category,
        },
        tags,
        originPrice,
        distCount,
        quantity,
        images: selectedImage,
      };
      const res = await ProductService.createProduct(product);
      if (res.success) {
        toast.success("Successful product addition");
        dispatch(getAllProductRd());
        setName("");
        setDescription([]);
        setNewDescription("");
        setTags("");
        setOriginPrice("");
        setQuantity("");
        setSelectedImage(null);
      } else {
        toast.error("An error occurred");
      }
      setIsLoading(false);
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
  };
  useEffect(() => {
    if (selectedImage) {
      setEditProduct((prevEditProduct) => ({
        ...prevEditProduct,
        newImage: selectedImage,
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
      toast.success("Product update successful");
    }
  };
  const handleDelete = async () => {
    setIsLoading(true);
    const res = await ProductService.deleteProduct(idProduct);
    setShowModalDelete(false);
    if (res.success) {
      dispatch(getAllProductRd());
      toast.success("Product deletion successful");
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
          tags: item.tags,
          createdAt: item.createdAt,
        };
        res.push(product);
      });
      setDataExport(res);
    }
  };
  const handleNewDescription = () => {
    if (newDescription.trim() !== "") {
      setDescription([...description, newDescription]);
      setNewDescription("");
    }
  };

  const handleReviewProduct = () => {
    setShowModalInfor(false);
  };
  return (
    <div className="w-full flex flex-col">
      <div className="flex  md:flex-row m-2 justify-between">
        <span
          className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-red-500  text-white"
          onClick={() => setShowModalAdd(true)}
        >
          <AiOutlineCloudUpload className="md:text-[30px] text-[20px]" />
          <h2 className="font-[600] px-1 ">Import</h2>
        </span>
        <CSVLink
          filename="products.csv"
          className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-[#73c509]  text-white"
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
        title="Add new product"
        open={showModalAdd}
        onOk={handleAddProduct}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Name</p>
          <input
            value={name}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setName(e.target.value)}
            placeholder="Add product name"
          />
        </label>
        <label className="flex justify-center items-center">
          <p className="w-[20%] font-[500]">Description</p>
          <div className="flex flex-col w-[80%]">
            {description?.length > 0 && (
              <div className="flex flex-col">
                {description?.map((desc, index) => (
                  <input
                    className="w-full md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
                    key={index}
                    value={desc}
                    readOnly
                  />
                ))}
              </div>
            )}
            <div className="flex">
              <input
                type="text"
                placeholder="Add new description"
                value={newDescription}
                className="w-[90%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <button
                className="ml-2  text-[#73c509]"
                onClick={handleNewDescription}
              >
                <AiOutlineSend className="md:text-[30px]" />
              </button>
            </div>
          </div>
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Category</p>
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
          <p className="w-[20%] font-[500]">Tags</p>
          <input
            value={tags}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add event name"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Price</p>
          <input
            value={originPrice}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setOriginPrice(e.target.value)}
            placeholder="Extra price"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Dist Count</p>
          <input
            value={distCount}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setdistCount(e.target.value)}
            placeholder="Add percentage discount"
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Quantity</p>
          <input
            value={quantity}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Add product quantity"
          />
        </label>
        <label className="flex items-center my-8 w-[30%] ">
          <label
            htmlFor="inport"
            className="bg-[#4b8600] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2"
          >
            Image
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
        title="Update product"
        open={showModalEdit}
        onOk={handleEditProduct}
        onCancel={handleCancel}
        okButtonProps={okButtonEdit}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Name</p>
          <input
            value={editProduct.name}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
          />
        </label>
        <label className="flex justify-center items-center">
          <p className="w-[20%] font-[500]">Description</p>
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
          <p className="w-[20%] font-[500]">Category</p>
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
          <p className="w-[20%] font-[500]">Tags</p>
          <input
            value={editProduct.tags}
            required={true}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, tags: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Price</p>
          <input
            value={editProduct.originPrice}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, originPrice: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Dist Count</p>
          <input
            value={editProduct.distCount}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, distCount: e.target.value })
            }
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Quantity</p>
          <input
            value={editProduct.quantity}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditProduct({ ...editProduct, quantity: e.target.value })
            }
          />
        </label>
        <label className="flex items-center my-8 w-[30%] ">
          <label
            htmlFor="inport"
            className="bg-[#4b8600] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2"
          >
            Image
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
              src={editProduct.images}
              alt=""
            />
          )}
        </label>
      </Modal>
      <Modal
        title="Delete"
        open={showModalDelete}
        onOk={handleDelete}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Are you sure you want to delete this product?`} </p>
      </Modal>
      <Modal
        title="Information product"
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
              <p className=" font-[500] w-[20%]">Name:</p>
              <p className="pl-2">{inforProduct?.name}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[20%]">Category:</p>
              <p className="pl-2">{inforProduct?.category?.name}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[20%]">Description:</p>
              <div className="pl-2 py-2">
                {inforProduct?.description.length > 0
                  ? inforProduct.description.map((item, index) => {
                      return <p key={index}>{item}</p>;
                    })
                  : null}
              </div>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[20%]">DistCount:</p>
              <p className="pl-2">{inforProduct?.distCount}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[20%]">OriginPrice:</p>
              <p className="pl-2">
                {inforProduct?.originPrice.toLocaleString()} đ
              </p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[20%]">Quantity:</p>
              <p className="pl-2">{inforProduct?.quantity}</p>
            </label>
            <label className="flex items-center">
              <p className=" font-[500] w-[20%]">sold_out:</p>
              <p className="pl-2">{inforProduct?.sold_out}</p>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Adminproduct;
