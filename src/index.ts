import yargs from 'yargs/yargs';
import { Day, ERROR_MESSAGE } from './common';
import * as Days from './days';

class Index {
  private static readonly DAYS = Object.values(Days);

  async main(args?: string[]) {
    const result = await yargs(args)
      .options({
        day: {
          type: 'number',
          optional: true,
          nullable: false,
          describe: 'Run a day in the advent of code.',
          alias: 'd',
          choices: Index.DAYS.map((_, index) => index + 1),
        },
        part: {
          type: 'number',
          optional: true,
          describe: 'Run part 1 or part 2 of a day.',
          alias: 'p',
          choices: [1, 2],
        },
        latest: {
          optional: true,
          describe: 'Run latest day.',
          conflicts: 'day',
          alias: 'l',
        },
        example: {
          type: 'number',
          optional: true,
          describe:
            'Run example input (usually 1 or 2) rather than real input for the given part/day.',
          alias: 'e',
        },
      })
      .version(false)
      .check((argv) => {
        if (argv.part && !(argv.day || argv.latest)) {
          throw new Error(
            "Can't provide part option without providing day or latest option as well.",
          );
        }

        if (Object.keys(argv).includes('day') && !argv.day) {
          throw new Error("Can't provide empty day option.");
        }

        if (Object.keys(argv).includes('part') && !argv.part) {
          throw new Error("Can't provide empty part option.");
        }

        return true;
      })
      .help()
      .usage('$0 run')
      .usage('$0 run -e')
      .usage('$0 run -d [day]')
      .usage('$0 run -d [day] -e')
      .usage('$0 run -d [day] -p [part]')
      .usage('$0 run -d [day] -p [part] -e')
      .usage('$0 run -d [day] -p [part] -e [ex]')
      .usage('$0 run -l')
      .usage('$0 run -l -e')
      .usage('$0 run -l -e [ex]')
      .showHelpOnFail(true, "This can't be run with these options.")
      .parse();
    if (!result) return;

    const part = result.part as 1 | 2 | undefined;
    const hasExample =
      (result.example as 1 | 2) ??
      Object.keys(result).includes('example') ??
      undefined;

    void (result.latest
      ? Index.runOne(Index.DAYS.length, part, hasExample)
      : result.day
      ? Index.runOne(result.day, part, hasExample)
      : Index.runAll(hasExample));
  }

  private static async getSolutions(example?: 1 | 2) {
    const puzzles = await Promise.all(
      Index.DAYS.map((a) => new a() as Day).map(
        async (a) => await a.init(example),
      ),
    );

    if (example) {
      return await Promise.all(
        puzzles.flatMap(async (a) => [
          {
            part: example,
            answer: await (example === 1 ? a.part1() : a.part2()),
          },
        ]),
      );
    }

    return await Promise.all(
      puzzles.flatMap(async (a) => [
        { part: 1, answer: await a.part1() },
        { part: 2, answer: await a.part2() },
      ]),
    );
  }

  private static async runAll(hasExample?: boolean | 1 | 2) {
    let solutions;
    if (hasExample) {
      const solutions1 = await Index.getSolutions(1);
      const solutions2 = await Index.getSolutions(2);

      if (solutions1.length !== solutions2.length) throw ERROR_MESSAGE;

      solutions = [];
      for (let i = 0; i < solutions1.length; i++) {
        solutions.push([...solutions1[i], ...solutions2[i]]);
      }
    } else {
      solutions = await Index.getSolutions();
    }

    solutions.map((solution, day) => {
      day++;
      console.log({
        day,
        solution,
      });
    });
  }

  private static async runOne(
    dayNumber: number,
    part?: 1 | 2,
    hasExample?: boolean | 1 | 2,
  ) {
    if (dayNumber > Index.DAYS.length) {
      throw ERROR_MESSAGE;
    }

    const solution = [];

    if (hasExample) {
      if (!part || part === 1) {
        const day = await new Index.DAYS[dayNumber - 1]().init(
          hasExample === undefined || hasExample === true ? 1 : hasExample,
        );
        solution.push({ part: 1, answer: await day.part1() });
      }
      if (!part || part === 2) {
        const day = await new Index.DAYS[dayNumber - 1]().init(
          hasExample === undefined || hasExample === true ? 2 : hasExample,
        );
        solution.push({ part: 2, answer: await day.part2() });
      }
    } else {
      const day = await new Index.DAYS[dayNumber - 1]().init();
      if (!part || part === 1) {
        solution.push({ part: 1, answer: await day.part1() });
      }
      if (!part || part === 2) {
        solution.push({ part: 2, answer: await day.part2() });
      }
    }

    console.log({
      day: dayNumber,
      solution,
    });
  }
}

void new Index().main(process.argv);
