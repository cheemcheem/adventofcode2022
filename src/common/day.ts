import { splitByDoubleLine, splitByLine } from './common';
import { ERROR_MESSAGE } from '.';

import NumberFormat = Intl.NumberFormat;

export abstract class Day {
  protected fileString?: string;
  protected abstract readonly dayNumber: number;

  async init(example?: 1 | 2) {
    const path = await import('path');
    const { promises } = await import('fs');
    const { readFile } = promises;
    this.fileString = (
      await readFile(
        path.join(
          __dirname,
          `../inputs/day-${new NumberFormat(undefined, {
            minimumIntegerDigits: 2,
          }).format(this.dayNumber)}${
            example ? `-example-${example}` : ''
          }.txt`,
        ),
      )
    ).toString();
    return this;
  }

  abstract part1(): Promise<number>;

  abstract part2(): Promise<number>;

  protected getString() {
    if (this.fileString) return this.fileString;
    throw ERROR_MESSAGE;
  }

  /**
   * @returns Returns the input split by line.
   */
  protected getSplitString = () => splitByLine(this.getString());

  /**
   * @returns Returns the input split by 2 new lines.
   */
  protected getDoubleSplitString = () => splitByDoubleLine(this.getString());
}
