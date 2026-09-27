// TAP Fitness — purple/black design tokens
export const colors = {
  bg: '#0A0612',          // near-black with a violet cast
  bgAlt: '#0F0919',
  surface: '#160D26',      // card surface
  surfaceRaised: '#1F1233',
  border: '#2A1B44',

  primary: '#8B5CF6',      // core violet (lightning bolt, CTAs)
  primaryDark: '#5B21B6',
  primaryBright: '#B388FF', // highlight / active glow
  accent: '#FF3EA5',       // hot pink-violet accent, used sparingly

  text: '#F4F0FF',
  textDim: '#A398C4',
  textFaint: '#6C6189',

  success: '#22D3A5',      // good form / rep confirmed
  danger: '#FF4D6D',       // bad form
  warning: '#FFB454',

  overlayScrim: 'rgba(10, 6, 18, 0.72)',
  cardScrim: 'rgba(10, 6, 18, 0.55)',
};

export const gradients = {
  hero: ['rgba(10,6,18,0.15)', 'rgba(10,6,18,0.95)'],
  card: ['rgba(10,6,18,0.05)', 'rgba(10,6,18,0.88)'],
};

export const radii = { sm: 10, md: 16, lg: 24, pill: 999 };
export const spacing = (n) => n * 4;
