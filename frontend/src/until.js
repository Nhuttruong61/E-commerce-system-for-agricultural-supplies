import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { format } from "date-fns";
import imageCompression from "browser-image-compression";
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
    twelveMonthsAgo.setFullYear(today.getFullYear() - 1);

    const monthlyRevenue = Array(12).fill(0);
    data.forEach((order) => {
      const paidDate = new Date(order.paymentInfo.paidAt);

      if (
        order.paymentInfo.status === "Đã thanh toán" &&
        paidDate >= twelveMonthsAgo &&
        paidDate <= today
      ) {
        const monthIndex = paidDate.getMonth();
        monthlyRevenue[monthIndex] += order.totalPrice;
      }
    });

    const chartData = monthlyRevenue.map((revenue, index) => ({
      name: format(new Date(today.getFullYear(), index, 1), "MM/yyyy"),
      uv: revenue,
    }));

    return chartData;
  } catch (e) {
    console.error(e);
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

export const converdataLineChart = ({ data }) => {
  try {
    const today = new Date();
    const sevenDays = new Date();
    sevenDays.setDate(today.getDate() - 7);

    let object = {};
    data.forEach((order) => {
      const paidDate = new Date(order.paymentInfo.paidAt);
      const formattedDate = paidDate.toISOString().split("T")[0];

      if (
        order.paymentInfo.status === "Đã thanh toán" &&
        paidDate >= sevenDays &&
        paidDate <= today
      ) {
        if (!object[formattedDate]) {
          object[formattedDate] = order.totalPrice;
        } else {
          object[formattedDate] += order.totalPrice;
        }
      }
    });

    const dataChart =
      Array.isArray(Object.keys(object)) &&
      Object.keys(object).map((item) => {
        return {
          name: item,
          pv: object[item],
        };
      });

    return dataChart;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const coverVertialChart = (user) => {
  try {
    const object = [];
    const userSort = user
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 9);
    userSort.forEach((item) => {
      object.push({
        name: item.name,
        pv: item.totalAmount,
      });
    });
    return object;
  } catch (e) {
    console.log(e);
    return [];
  }
};

// onchange image
export const handleOnchangeImage = async (e, setSelectedImage) => {
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
    console.error("Lỗi khi nén ảnh:", error);
  }
};
