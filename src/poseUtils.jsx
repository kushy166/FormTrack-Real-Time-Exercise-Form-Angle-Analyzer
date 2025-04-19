// poseUtils.js

export const calculateAngle = (point1, point2, point3) => {
  const vector1 = { x: point1.x - point2.x, y: point1.y - point2.y };
  const vector2 = { x: point3.x - point2.x, y: point3.y - point2.y };

  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
  const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);

  const angleRad = Math.acos(dotProduct / (magnitude1 * magnitude2));
  const angleDeg = (angleRad * 180) / Math.PI;

  return angleDeg;
};

export const checkSquatAngle = (angle) => {
  if (angle < 80) return "Angle too high. Keep lowering.";
  if (angle > 140) return "Angle too low. Stand up.";
  return "Squat Position Good!";
};

export const checkPushupAngle = (angle) => {
  if (angle < 45) return "Angle too high. Lower your body.";
  if (angle > 90) return "Angle too low. Push up.";
  return "Push-Up Position Good!";
};
