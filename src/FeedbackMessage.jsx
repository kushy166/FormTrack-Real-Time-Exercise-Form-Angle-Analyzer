import React from "react";

const FeedbackMessage = ({ message }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "10px",
        fontSize: "18px",
      }}
    >
      {message}
    </div>
  );
};

export default FeedbackMessage;
