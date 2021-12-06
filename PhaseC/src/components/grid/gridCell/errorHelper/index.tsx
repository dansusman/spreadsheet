import { Alert, AlertTitle } from "@mui/material";
import React from "react";
import "./ErrorHelper.css";

/**
 * Properties for the ErrorHelper, called Error Hinting Pop-up in
 * the Project Report.
 */
interface Props {
    error: string;
    cellRef: React.RefObject<HTMLInputElement>;
}

/**
 * The ErrorHelper React component, which displays if the selected
 * cell is in Error state. This component provides bonus information
 * about what is happening to cause the error and hints the user
 * at how to fix it.
 */
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
