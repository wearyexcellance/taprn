import { kneeAngle, hipAngle, elbowAngle, shoulderAngle } from './angleMath';

// Each exercise defines which angle to watch, and the "down"/"up" thresholds
// that drive the state machine. Angles are in degrees.
export const EXERCISES = {
  squat: {
    label: 'Squat',
    getAngle: (pose) => avg([kneeAngle(pose, 'left'), kneeAngle(pose, 'right')]),
    downBelow: 100, // knee bent
    upAbove: 160, // standing tall
    goodFormRange: [80, 100], // ideal depth at the bottom
  },
  pushup: {
    label: 'Push-up',
    getAngle: (pose) => avg([elbowAngle(pose, 'left'), elbowAngle(pose, 'right')]),
    downBelow: 95,
    upAbove: 155,
    goodFormRange: [80, 100],
  },
  lunge: {
    label: 'Lunge',
    getAngle: (pose) => kneeAngle(pose, 'left'),
    downBelow: 110,
    upAbove: 165,
    goodFormRange: [85, 110],
  },
  jumpingJack: {
    label: 'Jumping Jack',
    // arm raise proxy: shoulder angle opens wide at the top of the jack
    getAngle: (pose) => avg([shoulderAngle(pose, 'left'), shoulderAngle(pose, 'right')]),
    downBelow: 40,
    upAbove: 150,
    goodFormRange: [150, 180],
  },
  armRaise: {
    label: 'Arm Raise',
    getAngle: (pose) => avg([shoulderAngle(pose, 'left'), shoulderAngle(pose, 'right')]),
    downBelow: 30,
    upAbove: 160,
    goodFormRange: [155, 180],
  },
  hipHinge: {
    label: 'Hip Hinge',
    getAngle: (pose) => avg([hipAngle(pose, 'left'), hipAngle(pose, 'right')]),
    downBelow: 100,
    upAbove: 160,
    goodFormRange: [90, 110],
  },
};

function avg(values) {
  const valid = values.filter((v) => typeof v === 'number' && !Number.isNaN(v));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

// Simple two-state machine: "down" <-> "up". A rep is counted every time the
// user transitions from "down" back to "up" (bottom-of-movement -> lockout).
export function createRepCounter(exerciseKey, { repsPerSet = 10 } = {}) {
  const config = EXERCISES[exerciseKey] ?? EXERCISES.squat;

  let state = {
    phase: 'up', // 'up' | 'down'
    reps: 0,
    sets: 0,
    lastAngle: null,
    formStatus: 'neutral', // 'good' | 'bad' | 'neutral'
  };

  function reset() {
    state = { phase: 'up', reps: 0, sets: 0, lastAngle: null, formStatus: 'neutral' };
  }

  function update(pose) {
    const angle = config.getAngle(pose);
    if (angle == null) {
      return { ...state, angle: state.lastAngle };
    }

    state.lastAngle = angle;

    // Form check only meaningful near the bottom of the movement.
    if (angle <= config.downBelow + 15) {
      const [lo, hi] = config.goodFormRange;
      state.formStatus = angle >= lo && angle <= hi ? 'good' : 'bad';
    } else {
      state.formStatus = 'neutral';
    }

    if (state.phase === 'up' && angle < config.downBelow) {
      state.phase = 'down';
    } else if (state.phase === 'down' && angle > config.upAbove) {
      state.phase = 'up';
      state.reps += 1;
      if (state.reps > 0 && state.reps % repsPerSet === 0) {
        state.sets += 1;
      }
    }

    return { ...state, angle };
  }

  function getDisplayCounter() {
    // Matches the spec's "10x4" (reps x sets) / "down 0x0" formatting.
    const prefix = state.phase === 'down' ? 'down ' : '';
    return `${prefix}${state.reps}x${state.sets}`;
  }

  return { update, reset, getState: () => state, getDisplayCounter, config };
}
