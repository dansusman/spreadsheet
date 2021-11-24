import React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "./store";
import Grid from "./components/grid";
import TopBar from "./components/topBar";
import "./App.css";

function App() {
    return (
        <div className="app">
            <TopBar />
            <Grid />
        </div>
    );
}

export default App;
