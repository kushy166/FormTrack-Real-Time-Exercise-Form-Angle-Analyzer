// poseUtils.jsx

export const calculateAngle = (A, B, C) => {
  const AB = [A.x - B.x, A.y - B.y];
  const CB = [C.x - B.x, C.y - B.y];

  const dot = AB[0] * CB[0] + AB[1] * CB[1];
  const magAB = Math.hypot(AB[0], AB[1]);
  const magCB = Math.hypot(CB[0], CB[1]);

  const angle = Math.acos(dot / (magAB * magCB));
  return (angle * 180) / Math.PI;
};

export const checkSquatAngle = (angle) => {
  if (angle < 80) return "Go deeper!";
  if (angle > 140) return "Too shallow!";
  return "Squat looks good!";
};

export const checkPushupAngle = (angle) => {
  if (angle < 45) return "Too low!";
  if (angle > 90) return "Not low enough!";
  return "Elbow angle good.";
};

export const checkBodyAngle = (angle) => {
  if (angle < 170) return "Keep your body straight!";
  return "Body posture is good.";
};

export const checkHipAngle = (angle) => {
  if (angle < 145) return "Don't drop your hips!";
  return "Hip alignment is fine.";
};
