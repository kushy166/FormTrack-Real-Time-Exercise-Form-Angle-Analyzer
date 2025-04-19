// PoseDetector.jsx

import React, { useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from "@mediapipe/tasks-vision";
import FeedbackMessage from "./FeedbackMessage";
import { calculateAngle, checkSquatAngle, checkPushupAngle } from "./poseUtils";

export default function PoseDetector({ exercise }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const landmarkerRef = useRef();
  const rafId = useRef();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [angles, setAngles] = useState({});
  const [landmarks, setLandmarks] = useState([]);

  useEffect(() => {
    let running = true;

    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1
      });

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const drawingUtils = new DrawingUtils(ctx);

      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          detectPose();
        };
      });

      const detectPose = () => {
        if (!running || !landmarkerRef.current) return;

        landmarkerRef.current.detectForVideo(video, performance.now(), (result) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (result.landmarks && result.landmarks.length > 0) {
            const landmarks = result.landmarks[0];
            setLandmarks(landmarks);

            drawingUtils.drawLandmarks(landmarks, {
              color: "lime",
              lineWidth: 2
            });
            drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
              color: "white",
              lineWidth: 2
            });

            const hip = landmarks[23]; // Left hip
            const knee = landmarks[25]; // Left knee
            const ankle = landmarks[27]; // Left ankle

            const angle = calculateAngle(hip, knee, ankle);

            setAngles((prevAngles) => ({
              ...prevAngles,
              leftLegAngle: angle,
            }));

            if (exercise === "squat") {
              const feedback = checkSquatAngle(angle);
              setFeedbackMessage(feedback);
            } else if (exercise === "pushup") {
              const feedback = checkPushupAngle(angle);
              setFeedbackMessage(feedback);
            }
          }
        });

        rafId.current = requestAnimationFrame(detectPose);
      };
    };

    init();

    return () => {
      running = false;
      cancelAnimationFrame(rafId.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [exercise]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-auto z-0"
        style={{ transform: "none" }}
        autoPlay
        muted
      />
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-auto"
        width={640}
        height={480}
      />
      {/* Display the angle */}
      {angles.leftLegAngle && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            color: angles.leftLegAngle < 80 || angles.leftLegAngle > 140 ? "red" : "lime",
            fontSize: "18px",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          {`Left Leg Angle: ${angles.leftLegAngle.toFixed(2)}°`}
        </div>
      )}
      <FeedbackMessage message={feedbackMessage} />
    </div>
  );
}
