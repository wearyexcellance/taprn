// Joint angle math for pose-detection keypoints.
// Given three keypoints A - B - C, returns the interior angle at B in degrees,
// using theta = arccos( (BA . BC) / (|BA| |BC|) ).

export function angleBetween(A, B, C) {
  if (!A || !B || !C) return null;
  if ([A.score, B.score, C.score].some((s) => typeof s === 'number' && s < 0.3)) {
    return null; // low-confidence keypoint, skip this frame
  }

  const BA = { x: A.x - B.x, y: A.y - B.y };
  const BC = { x: C.x - B.x, y: C.y - B.y };

  const dot = BA.x * BC.x + BA.y * BC.y;
  const magBA = Math.hypot(BA.x, BA.y);
  const magBC = Math.hypot(BC.x, BC.y);
  if (magBA === 0 || magBC === 0) return null;

  const cos = Math.min(1, Math.max(-1, dot / (magBA * magBC)));
  const radians = Math.acos(cos);
  return (radians * 180) / Math.PI;
}

// Convenience lookup: pose-detection keypoint arrays are indexed by name.
export function getKeypoint(pose, name) {
  return pose?.keypoints?.find((k) => k.name === name) ?? null;
}

// Named joint-angle helpers built on the MoveNet/BlazePose 17-33 keypoint schema.
export function kneeAngle(pose, side = 'left') {
  return angleBetween(
    getKeypoint(pose, `${side}_hip`),
    getKeypoint(pose, `${side}_knee`),
    getKeypoint(pose, `${side}_ankle`)
  );
}

export function hipAngle(pose, side = 'left') {
  return angleBetween(
    getKeypoint(pose, `${side}_shoulder`),
    getKeypoint(pose, `${side}_hip`),
    getKeypoint(pose, `${side}_knee`)
  );
}

export function elbowAngle(pose, side = 'left') {
  return angleBetween(
    getKeypoint(pose, `${side}_shoulder`),
    getKeypoint(pose, `${side}_elbow`),
    getKeypoint(pose, `${side}_wrist`)
  );
}

export function shoulderAngle(pose, side = 'left') {
  return angleBetween(
    getKeypoint(pose, `${side}_hip`),
    getKeypoint(pose, `${side}_shoulder`),
    getKeypoint(pose, `${side}_elbow`)
  );
}
