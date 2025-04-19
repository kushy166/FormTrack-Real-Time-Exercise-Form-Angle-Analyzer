//FeedbackMessage.jsx

import React from "react";

export default function FeedbackMessage({ message }) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg text-center text-sm sm:text-base max-w-xs z-20">
      {message}
    </div>
  );
}
