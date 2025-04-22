// utils/poseUtils.js

import { calculateAngle } from './poseUtils'; // adjust import if paths differ

export const calculateKneeAngle = (landmarks, side = 'left') => {
  const hip = side === 'left' ? landmarks[23] : landmarks[24];    // Hip
  const knee = side === 'left' ? landmarks[25] : landmarks[26];   // Knee
  const ankle = side === 'left' ? landmarks[27] : landmarks[28];  // Ankle

  if (!hip || !knee || !ankle) return 0;

  return Math.round(calculateAngle(hip, knee, ankle));  // A = hip, B = knee, C = ankle
};


