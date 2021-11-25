import React from "react";
import Grid from "./components/grid";
import TopBar from "./components/topBar";
import "./App.css";
import FXBar from "./components/fxBar";

function App() {
    return (
        <div className="app">
            <TopBar />
            <FXBar />
            <Grid />
        </div>
    );
}

export default App;
