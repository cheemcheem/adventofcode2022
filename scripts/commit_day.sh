#! /bin/bash
set -e;

usage() {
    echo "Usage:";
    echo "  commit_day.sh [day_number]"
    echo "";
    echo "Parameters:";
    echo "  day_number: An integer between and including 1 and 25."
}

check_input() {
    input=$1;

    # Check input exists, is a number, is between and including 1 - 25
    if [ -z $input ] || ! [[ $input =~ ^[0-9]+$ ]] || [ $input -lt 1 ] || [ $input -gt 25 ]; 
        then usage && exit 1; 
    fi;
}

commit_day() {
    input=$1;

    # Stage changes in git 
    git add --all;
    
    git commit -m "Day $input"
    # git push
}

case $1 in
*)
    check_input $1 && commit_day $1;;
esac;