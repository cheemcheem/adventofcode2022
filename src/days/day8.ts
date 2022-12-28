import { DayTemplate, sumNumbers } from '../common';

const getForest = (rows: string[]): Forest => {
  return rows.map((row) => row.split('').map(Number));
};

const getVisibility = (forest: Forest): number => {
  const visibleArray = forest.map((row) => row.map(() => 0));

  forest.forEach((row, y) => {
    row.forEach((_, x) => {
      if (isTreeVisible({ x, y }, forest)) {
        visibleArray[y][x] = 1;
      }
    });
  });

  return sumNumbers(visibleArray?.flatMap((x) => x) ?? []);
};

const isTreeVisibleInDirection = (start: Coordinates, direction: Coordinates, forest: Forest): boolean => {
  const startHeight = getHeight(start, forest);
  let location = add(start, direction);
  while (withinBounds(location, forest)) {
    if (getHeight(location, forest) >= startHeight) {
      return false;
    }
    location = add(location, direction);
  }
  return true;
};

const isTreeVisible = (location: Coordinates, forest: Forest): boolean => {
  for (const direction of unitVectors) {
    if (isTreeVisibleInDirection(location, direction, forest)) {
      return true;
    }
  }
  return false;
};

const treesVisibleFromTree = (start: Coordinates, direction: Coordinates, forest: Forest): number => {
  const startHeight = getHeight(start, forest);
  const location = add(start, direction);
  let count = 0;
  while (withinBounds(location, forest)) {
    if (getHeight(location, forest) >= startHeight) {
      return count + 1;
    }
    count++;
    addInPlace(direction, location);
  }
  return count;
};

const getTreeScenicScore = (location: Coordinates, forest: Forest): number => {
  return unitVectors
    .map((direction) => {
      return treesVisibleFromTree(location, direction, forest);
    })
    .reduce((a, b) => a * b);
};

const getScenicScore = (forest: Forest): number => {
  const visibleArray = forest.map((row) => row.map(() => 0));

  forest.forEach((row, y) => {
    row.forEach((_, x) => {
      visibleArray[y][x] = getTreeScenicScore({ x, y }, forest);
    });
  });

  return (visibleArray?.flatMap((x) => x) ?? []).reduce((a, b) => (a > b ? a : b));
};

class Day extends DayTemplate {
  readonly dayNumber = 8;

  part1 = async () => {
    const input = this.getSplitString();
    const forest = getForest(input);
    const visible = getVisibility(forest);
    return visible;
  };

  part2 = async () => {
    const input = this.getSplitString();
    const forest = getForest(input);
    const scenicScore = getScenicScore(forest);
    return scenicScore;
  };
}

export const Day8 = new Day();

type Col = number;
type Rows = Col[];
type Forest = Rows[];

type Coordinates = {
  x: number;
  y: number;
};

const add = (a: Coordinates, b: Coordinates): Coordinates => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

const addInPlace = (value: Coordinates, to: Coordinates): void => {
  to.x += value.x;
  to.y += value.y;
};

const getHeight = ({ x, y }: Coordinates, forest: Forest): Col => forest[y][x];

const withinBounds = ({ x, y }: Coordinates, forest: Forest): boolean => {
  return x >= 0 && x <= forest[0].length - 1 && y >= 0 && y <= forest.length - 1;
};

const unitVectors: [Coordinates, Coordinates, Coordinates, Coordinates] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];
