import React, { useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from "@mediapipe/tasks-vision";
import FeedbackMessage from "./FeedbackMessage"; // Import FeedbackMessage

export default function PoseDetector({ exercise }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const landmarkerRef = useRef();
  const rafId = useRef();
  const [feedbackMessage, setFeedbackMessage] = useState(""); // State for feedback message

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
            drawingUtils.drawLandmarks(result.landmarks[0], {
              color: "lime",
              lineWidth: 2
            });
            drawingUtils.drawConnectors(result.landmarks[0], PoseLandmarker.POSE_CONNECTIONS, {
              color: "white",
              lineWidth: 2
            });

            // Add logic for squat/push-up detection
            if (exercise === "squat") {
              // Placeholder logic for squat detection
              setFeedbackMessage("Squat Detected");
            } else if (exercise === "pushup") {
              // Placeholder logic for push-up detection
              setFeedbackMessage("Push-up Detected");
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
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
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
      {/* Show the feedback message */}
      <FeedbackMessage message={feedbackMessage} />
    </div>
  );
}
