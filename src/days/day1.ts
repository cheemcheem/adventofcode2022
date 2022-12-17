import { DayTemplate, splitByLine, sumNumbers } from '../common';

class Day extends DayTemplate {
  readonly dayNumber = 1;

  part1 = async () => {
    const elves = this.getDoubleSplitString();
    const elfCalories = elves.map((elfCalorieList) => {
      const calories = splitByLine(elfCalorieList).map(Number);
      return sumNumbers(calories);
    });
    elfCalories.sort((a, b) => b - a);
    const [max] = elfCalories;
    return max;
  };

  part2 = async () => {
    const elves = this.getDoubleSplitString();
    const elfCalories = elves.map((elfCalorieList) => {
      const calories = splitByLine(elfCalorieList).map(Number);
      return sumNumbers(calories);
    });
    elfCalories.sort((a, b) => b - a);
    const [max, second, third] = elfCalories;
    return max + second + third;
  };
}

export const Day1 = new Day();
