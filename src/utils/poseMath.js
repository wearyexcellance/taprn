/**
 * poseMath.js
 * -----------
 * Pure, framework-free helpers: turn three keypoints into an angle in
 * degrees (theta = arccos( (A·B) / (|A||B|) )), and turn a stream of
 * angles into rep counts + a form verdict. Kept dependency-free and pure
 * so it's trivially testable outside of React Native / TFJS.
 */

// Angle at `vertex`, between vertex->a and vertex->b, in degrees.
export function angleBetween(a, vertex, b) {
  if (!a || !vertex || !b) return null;

  const vA = { x: a.x - vertex.x, y: a.y - vertex.y };
  const vB = { x: b.x - vertex.x, y: b.y - vertex.y };

  const dot = vA.x * vB.x + vA.y * vB.y;
  const magA = Math.hypot(vA.x, vA.y);
  const magB = Math.hypot(vB.x, vB.y);

  if (magA === 0 || magB === 0) return null;

  // Clamp for float safety — arccos is undefined outside [-1, 1].
  const cos = Math.min(1, Math.max(-1, dot / (magA * magB)));
  const radians = Math.acos(cos);
  return (radians * 180) / Math.PI;
}

export function angleForExercise(keypointsByName, jointTriple) {
  const [aName, vertexName, bName] = jointTriple;
  const a = keypointsByName[aName];
  const vertex = keypointsByName[vertexName];
  const b = keypointsByName[bName];
  return angleBetween(a, vertex, b);
}

/**
 * RepCounter
 * ----------
 * A tiny hysteresis state machine: a rep only completes when the tracked
 * angle has crossed fully from "up" to "down" and back to "up" (or vice
 * versa, per exercise), which prevents jitter around a single threshold
 * from double-counting.
 */
export class RepCounter {
  constructor({ downAngle, upAngle, goodFormMinAngle, onRep }) {
    this.downAngle = downAngle;
    this.upAngle = upAngle;
    this.goodFormMinAngle = goodFormMinAngle;
    this.onRep = onRep;

    this.state = "up"; // "up" | "down"
    this.reps = 0;
    this.sets = 0;
    this.lastFormOk = true;
    this.minAngleThisRep = Infinity;
  }

  reset() {
    this.state = "up";
    this.reps = 0;
    this.minAngleThisRep = Infinity;
  }

  nextSet() {
    this.sets += 1;
    this.reps = 0;
    this.state = "up";
    this.minAngleThisRep = Infinity;
  }

  /** Feed a new angle reading (degrees). Returns current { reps, sets, formOk, state }. */
  update(angle) {
    if (angle == null || Number.isNaN(angle)) {
      return this.snapshot();
    }

    this.minAngleThisRep = Math.min(this.minAngleThisRep, angle);

    if (this.state === "up" && angle <= this.downAngle) {
      this.state = "down";
    } else if (this.state === "down" && angle >= this.upAngle) {
      this.state = "up";
      this.reps += 1;
      this.lastFormOk = this.minAngleThisRep >= this.goodFormMinAngle;
      this.minAngleThisRep = Infinity;
      if (this.onRep) this.onRep({ reps: this.reps, formOk: this.lastFormOk });
    }

    return this.snapshot();
  }

  /** Live form verdict for skeleton coloring, independent of completed reps. */
  liveFormOk(angle) {
    if (angle == null) return true;
    if (this.state !== "down") return true;
    return angle >= this.goodFormMinAngle;
  }

  snapshot() {
    return {
      reps: this.reps,
      sets: this.sets,
      state: this.state,
      formOk: this.lastFormOk,
    };
  }
}
