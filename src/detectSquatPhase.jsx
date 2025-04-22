// detectSquatPhase.jsx
import { calculateKneeAngle } from "./aa";

function detectSquatPhases(prevLandmarks, currLandmarks) {
    const getY = (p) => p.y;
  
    const currHipY = (getY(currLandmarks.left_hip) + getY(currLandmarks.right_hip)) / 2;
    console.log(currHipY);

    const prevHipY = (getY(prevLandmarks.left_hip) + getY(prevLandmarks.right_hip)) / 2;
     console.log(prevHipY);
    const leftKneeAngle = calculateKneeAngle(currLandmarks, 'left');
  //  console.log(leftKneeAngle);
    const rightKneeAngle = calculateKneeAngle(currLandmarks, 'right');
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

   // console.log(avgKneeAngle);
  
   if (currHipY > prevHipY && avgKneeAngle < 100) {
    return 'Moving Down Down\n'.padEnd(20, ' ');
  } else if (currHipY < prevHipY && avgKneeAngle > 140) {
    return 'Rising UP UP\n'.padEnd(20, ' ');
  } else {
    return 'in between\n'.padEnd(20, ' ');
  }
  
  }

function extractLandmarks(landmarks) {
  return {
    left_hip: landmarks[23],
    right_hip: landmarks[24],
    left_knee: landmarks[25],
    right_knee: landmarks[26],
    left_ankle: landmarks[27],
    right_ankle: landmarks[28],
    // Add more if needed
  };
  }
  
  export { detectSquatPhases, extractLandmarks };

