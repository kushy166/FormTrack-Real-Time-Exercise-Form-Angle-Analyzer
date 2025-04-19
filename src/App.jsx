import React, { useState } from "react";
import PoseDetector from "./PoseDetector";

export default function App() {
  const [exercise, setExercise] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">AI Fitness Coach</h1>
      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setExercise("squat")}
        >
          Start Squats
        </button>
        <button
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setExercise("pushup")}
        >
          Start Push-Ups
        </button>
      </div>
      <PoseDetector exercise={exercise} />
    </div>
  );
}