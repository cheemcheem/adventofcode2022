import { EOL } from 'os';

export const ERROR_MESSAGE = '404 advent of code broken';

export const splitByLine = (input: string) => {
  return input.split(EOL);
};

export const splitByDoubleLine = (input: string) => {
  return input.split(EOL + EOL);
};
