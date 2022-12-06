import assert from 'node:assert';
import test, { describe } from 'node:test';
import { DayTemplate } from '../common';

enum Choice {
  ROCK = 1,
  PAPER = 2,
  SCISSORS = 3,
}

const getChoice = (input: string) => {
  switch (input) {
    case 'A':
    case 'X':
      return Choice.ROCK;
    case 'B':
    case 'Y':
      return Choice.PAPER;
    case 'C':
    case 'Z':
      return Choice.SCISSORS;
    default:
      throw new Error('Unexpected choice');
  }
};

enum Result {
  WIN = 6,
  DRAW = 3,
  LOSE = 0,
}

const getResult = (opponent: Choice, me: Choice) => {
  const subtraction = opponent - me;
  /**
   * | opponent | me | opponent - me | actual |
   * | 3        | 2  |  1            | lose   |
   * | 3        | 1  |  2            | win    |
   * | 2        | 1  |  1            | lose   |
   * | 2        | 3  | -1            | win    |
   * | 1        | 3  | -2            | lose   |
   * | 1        | 2  | -1            | win    |
   *
   * opponent - me = 0      => draw
   * opponent - me = 1 | -2 => lose
   * opponent - me = 2 | -1 => win
   *
   */
  switch (subtraction) {
    case 0:
      return Result.DRAW;
    case 1:
    case -2:
      return Result.LOSE;
    case 2:
    case -1:
      return Result.WIN;
    default:
      throw new Error('Unexpected choice');
  }
};

const getTargetResult = (input: string) => {
  switch (input) {
    case 'X':
      return Result.LOSE;
    case 'Y':
      return Result.DRAW;
    case 'Z':
      return Result.WIN;
    default:
      throw new Error(`Unexpected input '${input}'.`);
  }
};

const getTargetChoice = (opponent: Choice, targetResult: Result): Choice => {
  /**
   * | opponent | me | opponent - me | actual |
   * | 3        | 2  |  1            | lose   |
   * | 3        | 1  |  2            | win    |
   * | 2        | 1  |  1            | lose   |
   * | 2        | 3  | -1            | win    |
   * | 1        | 3  | -2            | lose   |
   * | 1        | 2  | -1            | win    |
   *
   * opponent - me = 0      => draw
   * opponent - me = 1 | -2 => lose
   * opponent - me = 2 | -1 => win
   *
   */
  switch (targetResult) {
    case Result.DRAW:
      return opponent;
    case Result.LOSE:
      return Math.max(opponent - 1, 0) || opponent + 2;
    case Result.WIN:
      return Math.max(opponent - 2, 0) || opponent + 1;
    default:
      throw new Error('Unexpected choice');
  }
};

describe('bootleg tests', () => {
  void test(() => assert(getTargetChoice(Choice.ROCK, Result.WIN) === Choice.PAPER));
  void test(() => assert(getTargetChoice(Choice.ROCK, Result.DRAW) === Choice.ROCK));
  void test(() => assert(getTargetChoice(Choice.ROCK, Result.LOSE) === Choice.SCISSORS));
  void test(() => assert(getTargetChoice(Choice.PAPER, Result.WIN) === Choice.SCISSORS));
  void test(() => assert(getTargetChoice(Choice.PAPER, Result.DRAW) === Choice.PAPER));
  void test(() => assert(getTargetChoice(Choice.PAPER, Result.LOSE) === Choice.ROCK));
  void test(() => assert(getTargetChoice(Choice.SCISSORS, Result.WIN) === Choice.ROCK));
  void test(() => assert(getTargetChoice(Choice.SCISSORS, Result.DRAW) === Choice.SCISSORS));
  void test(() => assert(getTargetChoice(Choice.SCISSORS, Result.LOSE) === Choice.PAPER));
});

class Day extends DayTemplate {
  readonly dayNumber = 2;

  part1 = async () => {
    const inputs = this.getSplitString().map((input) => input.split(' ').map(getChoice));
    const rounds = inputs.map(([opponent, me]) => getResult(opponent, me) + me);
    return rounds.reduce((a, b) => a + b);
  };

  part2 = async () => {
    const inputs = this.getSplitString().map((input) => {
      const opponent = getChoice(input[0]);
      const me = getTargetChoice(opponent, getTargetResult(input[2]));
      return [opponent, me];
    });
    const rounds = inputs.map(([opponent, me]) => getResult(opponent, me) + me);
    return rounds.reduce((a, b) => a + b);
  };
}

export const Day2 = new Day();
