#!/bin/bash
#
# =============================================================
# watch-files
#
# description: Scripts to detect file changes and execute specific commands.
#
# usage: watch-files.sh [-c COMMAND] [-f FILES]
# =============================================================
#

set -euC


# global variables
COMMAND=
FILES=
WAIT_TIME=1

# show help
function usage() {
  cat <<EOS >&2
usage: $0 [-c COMMAND] [-f FILES]
  -c COMMAND  Command to be executed like 'test hoge.py'
  -f FILES  Files to be monitored like './*.py'
EOS
    exit 1
}

# parse argsuments
#
# $@: args
# ouput: void
function parse_args() {
    while getopts ":hc:f:" opt; do
        case ${opt} in
            c )
                COMMAND="$OPTARG"
            ;;
            f )
                FILES="$OPTARG"
            ;;
            h )
                usage
                exit 2
            ;;
            * )
                echo "Invalid option: $OPTARG" 1>&2
                exit 2
            ;;
        esac
    done
    shift $((OPTIND -1))

    if [[ "$COMMAND" == "" ]] || [[ "$FILES" == "" ]]; then
        usage
    fi
}


# Execute compatible stat commands
#
# $1: files like 'foo.py'
# output: last updated unix time
function safe_stat() {
    local file=$1
    if stat --help >/dev/null 2>&1; then
        echo "$(stat -c %Y "$file")"
    else
        echo "$(stat -f %m "$file")"
    fi
}

# Get the update time of a files
#
# $1: files like './*.py'
# output: update time of the files
function get_updated_times_from_files() {
    local files=$1
    local changed_time=''

    find_result=$(find . -wholename "$files")
    for file in $find_result; do
        changed_time+="$(safe_stat "$file"),"
    done

    echo "$changed_time"
}

# Kill process if exists
#
# $1: process id
# output: void
function kill_process_if_exists() {
    local pid=$1

    if [[ -n "$pid" ]] && ps -p "$pid" &> /dev/null
    then
        kill "$pid"
    fi
}

function main() {
    local command="$1"
    local files="$2"
    local base_changed_time=''
    local changed_time=''
    local pid=''

    echo "watched $files ..."
    printf "If want to terminate, press to Ctrl-D\n"

    # get base updated times
    base_changed_time=$(get_updated_times_from_files "$files")

    # If not exists file, raise error
    if [[ -z "$base_changed_time" ]] ;then
        echo "Error: file not found: $files. please specify file path like './*.txt'"
        exit 1
    fi

    while :
    do
        # wait 1 second
        sleep $WAIT_TIME

        # get current updated times
        changed_time=$(get_updated_times_from_files "$files")

        if [[ "$base_changed_time" != "$changed_time" ]]; then
            kill_process_if_exists "$pid"

            # execute command
            eval "$command &"

            pid=$!
            base_changed_time="$changed_time"
        fi
    done
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    parse_args "$@"
    main "$COMMAND" "$FILES"
fi
