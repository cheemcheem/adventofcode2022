#! /bin/bash
set -e;

usage() {
    echo "Usage:";
    echo "  new_day.sh [day_number]"
    echo "  new_day.sh --all"
    echo "";
    echo "Parameters:";
    echo "  day_number: An integer between and including 1 and 25."
    echo "  --all: Generate all days between 1 and 25."
}

check_input() {
    input=$1;

    # Check input exists, is a number, is between and including 1 - 25
    if [ -z $input ] || ! [[ $input =~ ^[0-9]+$ ]] || [ $input -lt 1 ] || [ $input -gt 25 ]; 
        then usage && exit 1; 
    fi;
}

new_day() {
    input=$1;

    # Copy and rewrite templates for the target day
    cp src/days/dayTemplate.ts src/days/day$input.ts
    sed -i -e "s/= 0/= $input/g" src/days/day$input.ts
    sed -i -e "s/Day0/Day$input/g" src/days/day$input.ts
    touch "src/inputs/day-$(printf '%02d' "$input").txt"
    touch "src/inputs/day-$(printf '%02d' "$input")-example-1.txt"
    touch "src/inputs/day-$(printf '%02d' "$input")-example-2.txt"

    # Update index to export new day file
    if grep -q "\/\/ export \* from '\.\/day$input';" src/days/index.ts;
        then sed -i -e "s/\/\/ export \* from '.\/day$input';/export \* from '.\/day$input';/g" src/days/index.ts;
        else if ! grep -q "day$input" src/days/index.ts;
            then echo "export * from './day$input';" >> src/days/index.ts;
            else echo "The file 'src/days/index.ts' already mentions day$input. Leaving it alone."
        fi;
    fi;
}

all_days() {
    echo "Warning: This will overwrite any previous days & inputs. Continue? (y/n).";
    read input;
    if ! [[ $input = "y" ]]; then exit 0; fi;
    for day in {1..25}; do
        new_day $day
    done;
}

case $1 in
--all)
    all_days;;
*)
    check_input $1 && new_day $1;;
esac;