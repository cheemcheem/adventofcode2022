import { DayTemplate } from '../common';

const parseInput = (input: string) => {
  const [left, right] = input.split(',');
  const parseSide = (side: string) => side.split('-').map(Number);
  const [leftFrom, leftTo] = parseSide(left);
  const [rightFrom, rightTo] = parseSide(right);
  return {
    leftFrom,
    leftTo,
    rightFrom,
    rightTo,
  };
};

const isContained = (leftFrom: number, leftTo: number, rightFrom: number, rightTo: number) => {
  const leftContainsRight = rightFrom >= leftFrom && rightTo <= leftTo;
  const rightContainsLeft = leftFrom >= rightFrom && leftTo <= rightTo;
  return leftContainsRight || rightContainsLeft;
};

const isOverlapping = (leftFrom: number, leftTo: number, rightFrom: number, rightTo: number) => {
  const leftIsLessThanRight = leftTo < rightFrom;
  const rightIsLessThanLeft = rightTo < leftFrom;
  return !(leftIsLessThanRight || rightIsLessThanLeft);
};

class Day extends DayTemplate {
  readonly dayNumber = 4;

  part1 = async () => {
    const pairs = this.getSplitString().map(parseInput);
    const pairsContained = pairs.map(({ leftFrom, leftTo, rightFrom, rightTo }) =>
      isContained(leftFrom, leftTo, rightFrom, rightTo),
    );
    return pairsContained.filter((a) => a).length;
  };

  part2 = async () => {
    const pairs = this.getSplitString().map(parseInput);
    const pairsContained = pairs.map(({ leftFrom, leftTo, rightFrom, rightTo }) =>
      isOverlapping(leftFrom, leftTo, rightFrom, rightTo),
    );
    return pairsContained.filter((a) => a).length;
  };
}

export const Day4 = new Day();
