import React, { useState } from "react";
import Grid from "./components/grid";
import TopBar from "./components/topBar";
import "./App.css";
import FXBar from "./components/fxBar";
import { SelectedCell } from "./types";

function App() {
    const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
    return (
        <div className="app">
            <TopBar selectedCell={selectedCell} />
            <FXBar selectedCell={selectedCell} />
            <Grid setSelectedCell={setSelectedCell} />
        </div>
    );
}

export default App;
