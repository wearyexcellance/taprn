// Central catalog. Each exercise carries the joint triples used for angle
// calculation and the up/down angle thresholds used for rep counting, so
// the Execution screen stays generic and data-driven rather than having
// exercise-specific branching logic scattered through it.

export const PRO_CATEGORIES = [
  {
    id: "muay-thai",
    title: "Muay Thai",
    photo: "https://images.unsplash.com/photo-1517438322307-e67111335449",
    exercises: ["jumping-jacks", "squats", "push-ups"],
  },
  {
    id: "karate",
    title: "Karate",
    photo: "https://images.unsplash.com/photo-1555597673-b21d5c935865",
    exercises: ["lunges", "squats", "arm-raises"],
  },
  {
    id: "dumbbells",
    title: "Dumbbells",
    photo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    exercises: ["arm-raises", "squats"],
  },
];

export const EXPRESS_CATEGORIES = [
  {
    id: "strength-training",
    title: "Strength Training",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    exercises: ["squats", "push-ups", "lunges"],
  },
  {
    id: "yoga",
    title: "Yoga",
    photo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    exercises: ["arm-raises"],
  },
  {
    id: "full-body",
    title: "Full Body Workout",
    photo: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb",
    exercises: ["jumping-jacks", "squats", "push-ups", "lunges", "arm-raises"],
  },
  {
    id: "legs",
    title: "Legs Workout",
    photo: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d",
    exercises: ["squats", "lunges"],
  },
];

// jointTriple: [pointA, vertex, pointB] — angle is measured at `vertex`
// down/up: angle thresholds in degrees defining the two rep states
export const EXERCISES = {
  "jumping-jacks": {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    targetSets: 4,
    targetReps: 15,
    jointTriple: ["left_wrist", "left_shoulder", "left_hip"],
    downAngle: 30,   // arms down
    upAngle: 150,    // arms overhead
    goodFormMinAngle: 140, // at top of rep, arms should be near-straight overhead
  },
  squats: {
    id: "squats",
    name: "Squats",
    targetSets: 4,
    targetReps: 12,
    jointTriple: ["left_hip", "left_knee", "left_ankle"],
    downAngle: 100,  // knee bent, "down" position
    upAngle: 165,    // standing, leg extended
    goodFormMinAngle: 80, // don't let the knee angle collapse below this (too deep/unstable)
  },
  lunges: {
    id: "lunges",
    name: "Lunges",
    targetSets: 3,
    targetReps: 10,
    jointTriple: ["left_hip", "left_knee", "left_ankle"],
    downAngle: 100,
    upAngle: 165,
    goodFormMinAngle: 80,
  },
  "arm-raises": {
    id: "arm-raises",
    name: "Arm Raises",
    targetSets: 3,
    targetReps: 12,
    jointTriple: ["left_hip", "left_shoulder", "left_elbow"],
    downAngle: 20,
    upAngle: 90,
    goodFormMinAngle: 80,
  },
  "push-ups": {
    id: "push-ups",
    name: "Push-ups",
    targetSets: 4,
    targetReps: 10,
    jointTriple: ["left_shoulder", "left_elbow", "left_wrist"],
    downAngle: 90,
    upAngle: 160,
    goodFormMinAngle: 70,
  },
};

export function getExerciseById(id) {
  return EXERCISES[id];
}
