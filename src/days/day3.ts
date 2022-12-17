import { DayTemplate, sumNumbers } from '../common';

const aCharCode = 'a'.charCodeAt(0); // larger
const ACharCode = 'A'.charCodeAt(0); // smaller

const toCharCodes = (chars: string) =>
  chars.split('').map((char: string) => {
    const rawCharCode = char.charCodeAt(0) + 1; // Start at 1
    if (rawCharCode >= ACharCode && rawCharCode < aCharCode) {
      // A - Z
      return 26 + rawCharCode - ACharCode;
    }
    return rawCharCode - aCharCode;
  });

const splitRow = <T>(row: Array<T>) => {
  return {
    left: row.slice(0, row.length / 2),
    right: row.slice(row.length / 2, row.length),
  };
};

const calculateDuplicates = ({ left, right }: { left: number[]; right: number[] }) => {
  const duplicates = new Set<number>();
  const addIfDuplicateIn = (array: number[]) => (value: number) => array.includes(value) && duplicates.add(value);
  left.forEach(addIfDuplicateIn(right));
  right.forEach(addIfDuplicateIn(left));
  return Array.from(duplicates);
};

class Day extends DayTemplate {
  readonly dayNumber = 3;

  part1 = async () => {
    const inputRows = this.getSplitString();
    const duplicates = inputRows.map(toCharCodes).map(splitRow).map(calculateDuplicates);

    return sumNumbers(duplicates.flatMap((a) => a));
  };

  part2 = async () => {
    const inputRows = this.getSplitString();
    type Bag = number[];
    type Team = [Bag, Bag, Bag];
    const teams = Array<Team>();
    inputRows.map(toCharCodes).forEach((current, index) => {
      const teamIndex = Math.floor(index / 3);
      const teamMemberIndex = index % 3;
      if (teamMemberIndex === 0) {
        teams[teamIndex] = [[], [], []];
      }
      teams[teamIndex][teamMemberIndex] = current;
    });
    const duplicates = teams.map((team) => {
      const [bagOne, bagTwo, bagThree] = team;
      const firstDuplicates = calculateDuplicates({ left: bagOne, right: bagTwo });
      const finalDuplicates = calculateDuplicates({ left: firstDuplicates, right: bagThree });
      return finalDuplicates;
    });
    return sumNumbers(duplicates.flatMap((a) => a));
  };
}

export const Day3 = new Day();
