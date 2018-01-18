#!/bin/bash

if [ ! -t 0 ]; then
  echo "This script must be run from a terminal"
  exit 1
fi

echo "Press W, A, S, D to start and play..."
sleep 2
clear

UPLINE=$(tput cuu1)
ERASELINE=$(tput el)

EMPTY_STRING=''


stty -echo -icanon time 0 min 0

count=0
keypress=''
last_out="[__2__];[__2__];[_____];[_____];[_____];[_____];[_____];[_____];[_____];[_____];[_____];[_____];[_____];[_____];[_____];[_____];"
while true; do
  # This stuff goes in _handle_keys
  read keypress
  
  case $keypress in
  # This case is for no keypress
  "")
    ;;
  $'w')
    last_out="$(node movePieces.js $last_out up)"
    output_string="${last_out//;/$EMPTY_STRING}"
    echo -n "$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE"
    echo ${output_string:0:28}
    echo ''
    echo ${output_string:28:28}
    echo ''
    echo ${output_string:56:28}
    echo ''
    echo ${output_string:84:28}
    ;;
  $'s')
    last_out="$(node movePieces.js $last_out down)"
    output_string="${last_out//;/$EMPTY_STRING}"
    echo -n "$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE"
    echo ${output_string:0:28}
    echo ''
    echo ${output_string:28:28}
    echo ''
    echo ${output_string:56:28}
    echo ''
    echo ${output_string:84:28}
    ;;
  $'a')
   	last_out="$(node movePieces.js $last_out left)"
    output_string="${last_out//;/$EMPTY_STRING}"
    echo -n "$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE"
    echo ${output_string:0:28}
    echo ''
    echo ${output_string:28:28}
    echo ''
    echo ${output_string:56:28}
    echo ''
    echo ${output_string:84:28}
    ;;
  $'d')
   	last_out="$(node movePieces.js $last_out right)"
    output_string="${last_out//;/$EMPTY_STRING}"
    echo -n "$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE$UPLINE$ERASELINE"
    echo ${output_string:0:28}
    echo ''
    echo ${output_string:28:28}
    echo ''
    echo ${output_string:56:28}
    echo ''
    echo ${output_string:84:28}
   	;;

  # If you want to do something for unknown keys, otherwise leave this out
  *)
    ;;
  esac
  # End _handle_keys
done

stty sane
