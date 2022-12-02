import { Day } from '../common';
import { splitByLine } from '../common/common';

export default class Day1 extends Day {
  protected readonly dayNumber = 1;

  part1 = async () => {
    const elves = this.getDoubleSplitString();
    const elfCalories = elves.map((elfCalorieList) => {
      const calories = splitByLine(elfCalorieList).map(Number);
      return calories.reduce((a, b) => a + b);
    });
    elfCalories.sort((a, b) => b - a);
    const [max] = elfCalories;
    return max;
  };

  part2 = async () => {
    const elves = this.getDoubleSplitString();
    const elfCalories = elves.map((elfCalorieList) => {
      const calories = splitByLine(elfCalorieList).map(Number);
      return calories.reduce((a, b) => a + b);
    });
    elfCalories.sort((a, b) => b - a);
    const [max, second, third] = elfCalories;
    return max + second + third;
  };
}
