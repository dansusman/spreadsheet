import { configureStore } from "@reduxjs/toolkit";
import { render } from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { reducers } from "./store";

// Configure the Redux store
const store = configureStore({
    reducer: reducers,
});

const rootElement = document.getElementById("root");
render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);
