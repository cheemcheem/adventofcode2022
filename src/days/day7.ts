import { DayTemplate, splitByLine, sumNumbers } from '../common';

class Day extends DayTemplate {
  readonly dayNumber = 7;

  part1 = async () => {
    const commands = splitIntoCommands(this.getString());
    const root = processCommands(commands);
    return sizeDirectoriesLessThanSize(root, 100000);
  };

  part2 = async () => {
    const commands = splitIntoCommands(this.getString());
    const root = processCommands(commands);
    const totalSpace = 70000000;
    const targetFreeSpace = 30000000;
    const spaceRequired = targetFreeSpace - (totalSpace - sizeDirectory(root));
    return findSmallestDirectorySize(root, Math.abs(spaceRequired));
  };
}

export const Day7 = new Day();

type LSDirOutput = {
  name: string;
  type: 'dir';
};
type LSFileOutput = {
  name: string;
  type: 'file';
  size: number;
};
type LSOutput = LSDirOutput | LSFileOutput;
type LSCommand = {
  name: 'ls';
  output: LSOutput[];
};
type CDCommand = {
  name: 'cd';
  target: string;
};
type Command = CDCommand | LSCommand;

const splitIntoCommands = (input: string) => {
  const commands = input
    .split('$')
    .map((c) => c.trim())
    .filter((i) => i.length)
    .map<Command>((block) => {
      if (block.startsWith('cd')) {
        const [, target] = block.split(' ');
        return {
          name: 'cd',
          target,
        };
      } else {
        const [, ...outputLines] = splitByLine(block);
        return {
          name: 'ls',
          output: outputLines.map<LSOutput>((outputLine) => {
            const [dirOrSize, name] = outputLine.split(' ');
            if (dirOrSize === 'dir') {
              return {
                name,
                type: dirOrSize,
              };
            } else {
              return {
                name,
                type: 'file',
                size: Number(dirOrSize),
              };
            }
          }),
        };
      }
    });
  return commands;
};

type File = LSFileOutput;
type Directory = LSDirOutput & {
  children: (Directory | File)[];
  parent?: Directory;
};

const processCommands = (commands: Command[]) => {
  const rootPath = '/';
  const newRoot = (): Directory => ({ name: rootPath, type: 'dir', children: [] });

  const add = <T extends File | Directory>(fileOrDirectory: T, pwd: Directory): T => {
    const existing = pwd.children.find(({ name }) => name === fileOrDirectory.name);
    if (existing) return existing as T;

    pwd.children.push(fileOrDirectory);
    return fileOrDirectory;
  };

  const processCommand = (command: Command, pwd: Directory) => {
    if (command.name === 'cd') {
      switch (command.target) {
        case rootPath:
          return root;
        case '..':
          return pwd.parent;
        default:
          return add({ name: command.target, type: 'dir', children: [], parent: pwd }, pwd);
      }
    } else {
      command.output.forEach((output) => {
        if (output.type === 'dir') {
          add({ name: output.name, type: output.type, children: [], parent: pwd }, pwd);
        } else {
          add({ name: output.name, type: output.type, size: output.size }, pwd);
        }
      });
      return pwd;
    }
  };

  const root = newRoot();
  let pwd = root;

  commands.forEach((command) => {
    const newPwd = processCommand(command, pwd);
    if (!newPwd) throw new Error('Invalid Directory');
    pwd = newPwd;
  });

  return root;
};

const printDir = (dir: Directory) => {
  const removeCircularReferences = (fileOrDirectory: File | Directory): File | Omit<Directory, 'parent'> => {
    if (fileOrDirectory.type === 'dir') {
      return {
        name: fileOrDirectory.name,
        type: fileOrDirectory.type,
        children: fileOrDirectory.children.map(removeCircularReferences),
      };
    } else return fileOrDirectory;
  };

  console.log(JSON.stringify(removeCircularReferences(dir), undefined, 4));
};

const sizeDirectory = (directory: Directory): number => {
  return sumNumbers(
    directory.children.map((fileOrDirectory) => {
      if (fileOrDirectory.type === 'file') {
        return fileOrDirectory.size;
      }
      const directorySize = sizeDirectory(fileOrDirectory);
      return directorySize;
    }),
  );
};

const filterForDirectory = (child: Directory['children'][number]): child is Directory => child.type === 'dir';
const sizeDirectoriesLessThanSize = (root: Directory, maxSize: number) => {
  let total = 0;

  const sizeDirectoryLessThanSize = (pwd: Directory) => {
    const pwdSize = sizeDirectory(pwd);
    if (pwdSize < maxSize) {
      total += pwdSize;
    }
    pwd.children.filter(filterForDirectory).forEach(sizeDirectoryLessThanSize);
  };

  sizeDirectoryLessThanSize(root);
  return total;
};

const findSmallestDirectorySize = (root: Directory, minSize: number) => {
  let smallest = sizeDirectory(root);

  const findSmallerDirectoryThanSmallest = (pwd: Directory) => {
    const pwdSize = sizeDirectory(pwd);
    if (pwdSize >= minSize && pwdSize < smallest) {
      smallest = pwdSize;
    }
    if (pwdSize === minSize) return;
    for (const child of pwd.children.filter(filterForDirectory)) {
      findSmallerDirectoryThanSmallest(child);
    }
  };

  findSmallerDirectoryThanSmallest(root);
  return smallest;
};
