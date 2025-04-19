import React from "react";

const FeedbackMessage = ({ message }) => {
  return (
    <div
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-lg text-white bg-opacity-75 px-4 py-2 rounded-md"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontSize: "20px",
      }}
    >
      {message}
    </div>
  );
};

export default FeedbackMessage;
