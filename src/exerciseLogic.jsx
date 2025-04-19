export function getExerciseFeedback(landmarks, exercise) {
    if (!landmarks) return "No pose detected";
  
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
  
    function getAngle(a, b, c) {
      const ab = { x: b.x - a.x, y: b.y - a.y };
      const cb = { x: b.x - c.x, y: b.y - c.y };
      const dot = ab.x * cb.x + ab.y * cb.y;
      const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
      const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
      const angle = Math.acos(dot / (magAB * magCB));
      return (angle * 180) / Math.PI;
    }
  
    if (exercise === "squat") {
      const kneeAngle = getAngle(leftHip, leftKnee, leftAnkle);
      if (kneeAngle < 100) return "Squatting...";
      else return "Stand straight";
    } else if (exercise === "pushup") {
      const leftShoulder = landmarks[11];
      const leftElbow = landmarks[13];
      const leftWrist = landmarks[15];
      const elbowAngle = getAngle(leftShoulder, leftElbow, leftWrist);
      if (elbowAngle < 100) return "Push-up down";
      else return "Push-up up";
    }
  
    return "Exercise not detected";
  }
  