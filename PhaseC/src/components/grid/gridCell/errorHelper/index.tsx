import { Alert, AlertTitle } from "@mui/material";
import React from "react";
import "./ErrorHelper.css";

interface Props {
    error: string;
    cellRef: React.RefObject<HTMLInputElement>;
}

const ErrorHelper: React.FC<Props> = ({ error, cellRef }) => {
    if (error && cellRef.current === document.activeElement) {
        return (
            <Alert
                onClose={() => {}}
                variant="filled"
                severity="error"
                className="error"
            >
                <AlertTitle style={{ fontFamily: "inherit" }}>Error</AlertTitle>
                {error.split("\n").map((val, idx) => (
                    <div key={idx}>{val}</div>
                ))}
            </Alert>
        );
        // return <div className="error">{error}</div>;
    }
    return <></>;
};

export default ErrorHelper;
