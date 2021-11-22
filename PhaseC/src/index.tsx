import * as React from "react"
import { render } from "react-dom"
import { configureStore } from '@reduxjs/toolkit'
import { Provider} from "react-redux"
import App from "./App"
import {reducers} from "./store"

const store = configureStore({
  reducer : reducers
})

const rootElement = document.getElementById("root")
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)