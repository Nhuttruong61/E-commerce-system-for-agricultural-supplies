import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userReducer } from "./reducer/userReducer";
import { categoryReducer } from "./reducer/categoryReducer";
import { productReducer } from "./reducer/productReducer";
import { questionReducer } from "./reducer/questionsReducer";
import { eventReducer } from "./reducer/eventReducer";
import { orderReducer } from "./reducer/orderReducer";
import { cartReducer } from "./reducer/cartReducer";
import { feeReducer } from "./reducer/feeReducer";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  category: categoryReducer,
  product: productReducer,
  question: questionReducer,
  event: eventReducer,
  cart: cartReducer,
  order: orderReducer,
  fee: feeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const persistor = persistStore(store);

export { store, persistor };
