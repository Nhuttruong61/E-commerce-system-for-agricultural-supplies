import { startOfWeek, endOfWeek } from "date-fns";
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

export const converDataChartBar = (order) => {
  try {
    const today = new Date();
    const fiveWeeksAgo = new Date(today);
    fiveWeeksAgo.setDate(today.getDate() - 35);
    const object = {};
    order.forEach((order) => {
      const paidDate = new Date(order.paymentInfo.paidAt);
      if (paidDate >= fiveWeeksAgo && paidDate <= today) {
        const weekStart = startOfWeek(paidDate);
        const weekEnd = endOfWeek(paidDate);
        const weekKey = `${weekStart}-${weekEnd}`;
        if (!object[weekKey]) {
          object[weekKey] = {
            name: `${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`,
            revenue: order.totalPrice,
          };
        } else {
          object[weekKey].revenue = order.totalPrice;
        }
      }
    });
    const sortedWeeklyRevenues = Object.values(object).sort((a, b) => {
      const dateA = new Date(a.name.split(" - ")[0]);
      const dateB = new Date(b.name.split(" - ")[0]);
      return dateA - dateB;
    });
    console.log("sortedWeeklyRevenues", sortedWeeklyRevenues);
    return sortedWeeklyRevenues;
  } catch (e) {
    return [];
  }
};
