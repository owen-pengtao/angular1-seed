#!/usr/bin/env bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR
start(){
  cd $DIR
  npm install
  echo "[INFO] Start Server"
  local NODEMON_PATH="$DIR/node_modules/nodemon/bin/nodemon.js"
  if [ "$LOG" = "true" ]; then
    local LOG_PATH="$DIR/start.log"
    echo "[INFO] Server Log: $LOG_PATH"
    $NODEMON_PATH --ignore 'package.json, start.sh' --watch 'routes/*' app.js > $LOG_PATH &
    tail -n 10 -f $LOG_PATH &
  else
    nohup $NODEMON_PATH --ignore 'package.json, start.sh' --watch 'routes/*' app.js > /dev/null 2>&1 &
  fi
}
stop() {
  stopProcess "node.*app.js"
  stopProcess "tail.*start.log"
}
stopProcess() {
  ps -ef | grep "$1" | grep -v grep | awk '{print $2}' | xargs kill -9
}
restart() {
  stop
  start
}

case $1 in
  "start" | "restart" )
    for arg in "$@"
    do
      case $arg in
        -b)
          BROWSER="true"
          ;;
        -l)
          LOG="true"
          ;;
      esac
    done
    $1
    ;;
    "stop" )
    $1
    ;;
  *)
    echo "[ERROR]: Unrecognized option: $1"
    exit 1
    ;;
esac
