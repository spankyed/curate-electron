import { colors } from "../styles/theme";

export const getColorShadeRedToGreen = (paper: any): string => {
  if (!paper) {
    return 'transparent';
  }
  const { relevancy: value, isStarred } = paper;

  if (isStarred) {
    return 'white';
  }

  const greenRGB = [0, 145, 0];
  const yellowRGB = [145, 145, 0];
  const redRGB = [145, 0, 0];

  const interpolateRGB = (start: number[], end: number[], t: number): number[] =>
    start.map((channel, i) => Math.round(channel + t * (end[i] - channel)));

  const colorRGB = value <= 0.5
    ? interpolateRGB(redRGB, yellowRGB, value * 2) // Flip start and end colors
    : interpolateRGB(yellowRGB, greenRGB, (value - 0.5) * 2); // Flip start and end colors

  return `rgb(${colorRGB.join(', ')})`;
}
