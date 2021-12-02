import React from "react";
import "./ErrorHelper.css";

interface Props {
    error: string;
    cellRef: React.RefObject<HTMLInputElement>;
}

const ErrorHelper: React.FC<Props> = ({ error, cellRef }) => {
    if (error && cellRef.current === document.activeElement) {
        return <div className="error">{error}</div>;
    }
    return <></>;
};

export default ErrorHelper;
