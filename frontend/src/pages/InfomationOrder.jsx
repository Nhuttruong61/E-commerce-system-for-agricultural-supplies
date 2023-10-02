import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as OrderService from "../service/orderService";
import Loading from "../components/Loading";

function InfomationOrder() {
  const { id } = useParams();
  const [orders, setOrders] = useState(null);
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getOrder = async () => {
    setIsLoading(true);
    try {
      const res = await OrderService.getAOrder(id);
      setOrders(res.order);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getOrder();
    }
  }, [id]);

  useEffect(() => {
    if (orders && orders !== null) {
      const data = orders?.cart.map((order) => {
        return {
          id: order._id,
          category: order?.category?.name,
          name: order?.name,
          price: order?.originPrice,
        };
      });
      setOrder(data);
    }
  }, [orders]);

  console.log("order", order);

  return (
    <Loading isLoading={isLoading}>
      <div>InfomationOrder</div>;
    </Loading>
  );
}

export default InfomationOrder;
