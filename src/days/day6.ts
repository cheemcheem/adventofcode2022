import { DayTemplate } from '../common';

const allTheSame = (...characters: string[]) => {
  return new Set(characters).size === characters.length;
};

const findMarker = (input: string, markerLength: number) => {
  for (let i = markerLength; i < input.length; i++) {
    if (allTheSame(...input.slice(i - markerLength, i).split(''))) return i;
  }
  throw new Error('Unable to find marker');
};

class Day extends DayTemplate {
  readonly dayNumber = 6;

  part1 = async () => {
    return findMarker(this.getString(), 4);
  };

  part2 = async () => {
    return findMarker(this.getString(), 14);
  };
}

export const Day6 = new Day();
