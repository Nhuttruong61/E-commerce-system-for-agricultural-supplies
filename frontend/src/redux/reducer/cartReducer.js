import * as Type from "../Type/Cart";

const initialState = {
  cart: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.INCREASE_QUALTTY_CART: {
      const { data } = action;

      const itemIndex = state.cart.findIndex((item) => item._id === data._id);

      if (itemIndex !== -1) {
        const newQuantity = state.cart[itemIndex].quantity + data.quantity;
        const updatedCart = state.cart.map((item, index) => {
          return index === itemIndex && newQuantity <= item.quantityProduct
            ? { ...item, quantity: newQuantity }
            : item;
        });

        return {
          ...state,
          cart: updatedCart,
        };
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng
        return {
          ...state,
          cart: [...state.cart, { ...data }],
        };
      }
    }

    case Type.DECREASE_QUALTTY_CART: {
      const { data } = action;
      const itemIndex = state.cart.findIndex((item) => item._id === data._id);
      if (itemIndex !== -1) {
        const updatedCart = state.cart.map((item) =>
          item._id === data._id
            ? { ...item, quantity: item.quantity - data.quantity }
            : item
        );
        return {
          ...state,
          cart: updatedCart.filter((item) => item.quantity > 0),
        };
      } else {
        return state;
      }
    }
    case Type.CLEAR_QUALTTY_CART: {
      return {
        ...state,
        cart: [],
      };
    }
    default:
      return state;
  }
};
