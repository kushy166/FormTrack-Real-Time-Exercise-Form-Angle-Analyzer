//PoseDetector.jsx

import React, { useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from "@mediapipe/tasks-vision";
import FeedbackMessage from "./FeedbackMessage";
 import { detectSquatPhases, extractLandmarks } from "./detectSquatPhase";
import {
  calculateAngle,
  checkSquatAngle,
  checkPushupAngle,
  checkBodyAngle,
  checkHipAngle
} from "./poseUtils";

export default function PoseDetector({ exercise }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const landmarkerRef = useRef();
  const rafId = useRef();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [angles, setAngles] = useState({});
  const [landmarks, setLandmarks] = useState([]);
  const previousLandmarks = useRef(null);

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

        landmarkerRef.current.detectForVideo(
          video,
          performance.now(),
          (result) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (result.landmarks && result.landmarks.length > 0) {
              const landmarks = result.landmarks[0];
              setLandmarks(landmarks);

              drawingUtils.drawLandmarks(landmarks, {
                color: "lime",
                lineWidth: 2
              });
              drawingUtils.drawConnectors(
                landmarks,
                PoseLandmarker.POSE_CONNECTIONS,
                {
                  color: "white",
                  lineWidth: 2
                }
              );

              const shoulder = landmarks[11];
              const elbow = landmarks[13];
              const wrist = landmarks[15];
              const hip = landmarks[23];
              const knee = landmarks[25];
              const ankle = landmarks[27];




              if (exercise === "pushup") {
                const elbowAngle = calculateAngle(shoulder, elbow, wrist);
                const bodyAngle = calculateAngle(shoulder, hip, knee);
                const hipAngle = calculateAngle(shoulder, hip, knee);

                setAngles({
                  elbowAngle,
                  bodyAngle,
                  hipAngle
                });

                const elbowFeedback = checkPushupAngle(elbowAngle);
                const bodyFeedback = checkBodyAngle(bodyAngle);
                const hipFeedback = checkHipAngle(hipAngle);

                setFeedbackMessage(
                  `${elbowFeedback} ${bodyFeedback} ${hipFeedback}`
                );
              } else if (exercise === "squat") {
                const squatAngle = calculateAngle(hip, knee, ankle);
                setAngles({
                  squatAngle
                });

                const feedback = checkSquatAngle(squatAngle);

                const curr = extractLandmarks(landmarks);
                if (previousLandmarks.current) {
                  const phase = detectSquatPhases(previousLandmarks.current, curr);
                  //setFeedbackMessage(phase || feedback);
                  setFeedbackMessage(
                    `${feedback}          ${phase}`
                  );

                } else {
                  setFeedbackMessage(feedback);
                }

                previousLandmarks.current = curr;
              }
            }
          }
        );

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

      {exercise === "pushup" && angles.elbowAngle && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            color:
              angles.elbowAngle < 45 || angles.elbowAngle > 90
                ? "red"
                : "lime",
            fontSize: "18px",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "5px",
            borderRadius: "5px"
          }}
        >
          {`Elbow Angle: ${angles.elbowAngle.toFixed(2)}°`}
        </div>
      )}

      {exercise === "pushup" && angles.bodyAngle && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "50%",
            color:
              angles.bodyAngle < 170 || angles.bodyAngle > 180
                ? "red"
                : "lime",
            fontSize: "18px",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "5px",
            borderRadius: "5px"
          }}
        >
          {`Body Angle: ${angles.bodyAngle.toFixed(2)}°`}
        </div>
      )}

      {exercise === "pushup" && angles.hipAngle && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            color:
              angles.hipAngle < 145 || angles.hipAngle > 180
                ? "red"
                : "lime",
            fontSize: "18px",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "5px",
            borderRadius: "5px"
          }}
        >
          {`Hip Angle: ${angles.hipAngle.toFixed(2)}°`}
        </div>
      )}

      {exercise === "squat" && angles.squatAngle && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            color:
              angles.squatAngle < 80 || angles.squatAngle > 140
                ? "red"
                : "lime",
            fontSize: "18px",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "5px",
            borderRadius: "5px"
          }}
        >
          {`Knee Angle: ${angles.squatAngle.toFixed(2)}°`}
        </div>
      )}

      <FeedbackMessage message={feedbackMessage} />
    </div>
  );
}
