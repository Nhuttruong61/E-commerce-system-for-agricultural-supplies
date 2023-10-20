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
