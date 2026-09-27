// Two-family system: Sora carries the "electric" personality for headlines
// and the TAP mark; Inter stays quiet and legible for body copy + live data
// (rep counters, timers) where clarity under motion matters more than voice.
export const fonts = {
  display: "Sora_700Bold",
  displaySemi: "Sora_600SemiBold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemi: "Inter_600SemiBold",
};

export const type = {
  h1: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36 },
  h2: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: fonts.displaySemi, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16 },
  counter: { fontFamily: fonts.display, fontSize: 44, lineHeight: 48 },
};
