import { DayTemplate, splitByLine } from '../common';

type Stack = string[];
type Instruction = {
  move: number;
  from: number;
  to: number;
};

const parseStacks = (inputStacks: string) => {
  const [counts, ...rows] = splitByLine(inputStacks).reverse();
  const stackCount = counts.split('  ').length;
  const stacks: Stack[] = Array.from(Array(stackCount)).map(() => []);

  rows.forEach((row) => {
    const stackChars = 4;
    for (let stackIndex = 0; stackIndex < stackCount; stackIndex++) {
      const rowIndex = stackIndex * stackChars + 1;
      stacks[stackIndex].push(row[rowIndex]);
    }
  });

  return stacks.map((stack) => stack.filter((s) => s.trim().length > 0));
};

const parseInstructions = (inputInstructions: string) => {
  const rows = splitByLine(inputInstructions);
  const instructions = rows.map<Instruction>((row) => {
    const [_, move, __, from, ___, to] = row.split(' ').map(Number);
    return { move, from, to };
  });
  return instructions;
};

const executeInstruction = ({ move, from, to }: Instruction, stacks: Stack[]) => {
  for (let countToMove = 0; countToMove < move; countToMove++) {
    stacks[to - 1].push(stacks[from - 1].pop() ?? '');
  }
};

const execute9001Instruction = ({ move, from, to }: Instruction, stacks: Stack[]) => {
  const toStack = stacks[to - 1];
  const fromStack = stacks[from - 1];
  toStack.push(...fromStack.splice(fromStack.length - move, move));
};

const getTopCrates = (stacks: Stack[]) => String().concat(...stacks.map((stack) => stack[stack.length - 1][0]));
class Day extends DayTemplate {
  readonly dayNumber = 5;

  part1 = async () => {
    const [inputStacks, inputInstructions] = this.getDoubleSplitString();
    const stacks = parseStacks(inputStacks);
    const instructions = parseInstructions(inputInstructions);
    instructions.forEach((i) => executeInstruction(i, stacks));
    const topCrates = getTopCrates(stacks);
    return topCrates;
  };

  part2 = async () => {
    const [inputStacks, inputInstructions] = this.getDoubleSplitString();
    const stacks = parseStacks(inputStacks);
    const instructions = parseInstructions(inputInstructions);
    instructions.forEach((i) => execute9001Instruction(i, stacks));
    const topCrates = getTopCrates(stacks);
    return topCrates;
  };
}

export const Day5 = new Day();
