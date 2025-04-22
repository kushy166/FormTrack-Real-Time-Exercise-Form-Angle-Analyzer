//FeedbackMessage.jsx

import React from "react";

export default function FeedbackMessage({ message }) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg text-center text-3xl font-bold max-w-xs z-20">
      {message.split("\n").map((item, index) => (
        <span key={index}>
          {item}
          <br />
        </span>
      ))}
    </div>
  );
}
