import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { format } from "date-fns";
export const converDataChart = (order, type) => {
  try {
    const object = {};
    Array.isArray(order) &&
      order.forEach((opt) => {
        if (!object[opt[type]]) {
          object[opt[type]] = 1;
        } else {
          object[opt[type]] += 1;
        }
      });

    const result =
      Array.isArray(Object.keys(object)) &&
      Object.keys(object).map((item) => {
        return {
          name: item,
          value: object[item],
        };
      });
    return result;
  } catch (e) {
    return [];
  }
};

export const converDataChartBar = ({ data }) => {
  try {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const object = {};
    let weekNumber = 1;

    data.forEach((data) => {
      const paidDate = new Date(data.paymentInfo.paidAt);
      if (
        data.paymentInfo.status === "Đã thanh toán" &&
        paidDate >= monthStart &&
        paidDate <= monthEnd
      ) {
        const weekStart = startOfWeek(paidDate);
        const weekEnd = endOfWeek(paidDate);
        const weekKey = `${weekStart}-${weekEnd}`;

        if (!object[weekKey]) {
          object[weekKey] = {
            name: `${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`,
            revenue: data.totalPrice,
            weekNumber: weekNumber,
          };
          weekNumber++;
        } else {
          object[weekKey].revenue += data.totalPrice;
        }
      }
    });

    const sortedWeeklyRevenues = Object.values(object).sort((a, b) => {
      const dateA = new Date(a.name.split(" - ")[0]);
      const dateB = new Date(b.name.split(" - ")[0]);
      return dateA - dateB;
    });

    return sortedWeeklyRevenues;
  } catch (e) {
    return [];
  }
};

export const ConverChartComposed = ({ data }) => {
  try {
    const today = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(today.getMonth() - 12);
    const object = {};

    data.forEach((order) => {
      const paidDate = new Date(order.paymentInfo.paidAt);

      if (
        order.paymentInfo.status === "Đã thanh toán" &&
        paidDate >= twelveMonthsAgo &&
        paidDate <= today
      ) {
        const monthKey = format(paidDate, "yyyy-MM");

        if (!object[monthKey]) {
          object[monthKey] = {
            name: format(paidDate, "MM/yyyy"),
            uv: order.totalPrice,
          };
        } else {
          object[monthKey].uv += order.totalPrice;
        }
      }
    });

    const result = Object.values(object).map((item) => {
      return {
        name: item.name,
        uv: item.uv,
      };
    });
    return result;
  } catch (e) {
    return [];
  }
};
export const converDataChartProduct = ({ data }) => {
  try {
    const sortedData = data.sort((a, b) => b.sold_out - a.sold_out);
    const top10Products = sortedData.slice(0, 10);
    const formattedData = top10Products.map((item) => ({
      name: item.name,
      sold_out: item.sold_out,
    }));

    return formattedData;
  } catch (e) {
    console.error("Error:", e);
    return [];
  }
};
