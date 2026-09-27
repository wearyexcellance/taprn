// Placeholder photo backgrounds — swap for real asset requires() or CDN urls.
const ph = (seed) => `https://picsum.photos/seed/${seed}/800/1000`;

export const PRO_CATEGORIES = [
  { id: 'muay-thai', title: 'Muay Thai', image: ph('muay-thai'), tag: 'Combat' },
  { id: 'karate', title: 'Karate', image: ph('karate'), tag: 'Combat' },
  { id: 'dumbbells', title: 'Dumbbells', image: ph('dumbbells'), tag: 'Strength' },
];

export const EXPRESS_CATEGORIES = [
  { id: 'strength', title: 'Strength Training', image: ph('strength'), tag: 'Express' },
  { id: 'yoga', title: 'Yoga', image: ph('yoga'), tag: 'Express' },
  { id: 'full-body', title: 'Full Body Workout', image: ph('full-body'), tag: 'Express' },
  { id: 'legs', title: 'Legs Workout', image: ph('legs'), tag: 'Express' },
];

// Maps a category id to the routine of trackable exercises. `exerciseKey`
// must match a key in utils/repCounter.js EXERCISES.
export const ROUTINES = {
  'full-body': [
    { id: 'jumping-jacks', name: 'Jumping Jacks', exerciseKey: 'jumpingJack', targetReps: 20 },
    { id: 'squats', name: 'Squats', exerciseKey: 'squat', targetReps: 15 },
    { id: 'lunges', name: 'Lunges', exerciseKey: 'lunge', targetReps: 12 },
    { id: 'arm-raises', name: 'Arm Raises', exerciseKey: 'armRaise', targetReps: 15 },
    { id: 'push-ups', name: 'Push-ups', exerciseKey: 'pushup', targetReps: 10 },
  ],
  legs: [
    { id: 'squats', name: 'Squats', exerciseKey: 'squat', targetReps: 20 },
    { id: 'lunges', name: 'Lunges', exerciseKey: 'lunge', targetReps: 15 },
  ],
  strength: [
    { id: 'push-ups', name: 'Push-ups', exerciseKey: 'pushup', targetReps: 12 },
    { id: 'squats', name: 'Squats', exerciseKey: 'squat', targetReps: 15 },
  ],
  yoga: [{ id: 'hip-hinge-flow', name: 'Hip Hinge Flow', exerciseKey: 'hipHinge', targetReps: 10 }],
  dumbbells: [{ id: 'arm-raises', name: 'Arm Raises', exerciseKey: 'armRaise', targetReps: 15 }],
  'muay-thai': [{ id: 'jumping-jacks', name: 'Jumping Jacks', exerciseKey: 'jumpingJack', targetReps: 25 }],
  karate: [{ id: 'jumping-jacks', name: 'Jumping Jacks', exerciseKey: 'jumpingJack', targetReps: 25 }],
};
