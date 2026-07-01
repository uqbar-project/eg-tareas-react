#!/bin/bash
set -e

BACKEND_DIR="backend"
PORT=9000
REPO_URL="https://github.com/uqbar-project/eg-tareas-springboot-kotlin"

if [ ! -d "$BACKEND_DIR/.git" ]; then
  echo "Cloning backend into $BACKEND_DIR..."
  git clone "$REPO_URL" "$BACKEND_DIR"
else
  echo "Pulling latest changes in $BACKEND_DIR..."
  (cd "$BACKEND_DIR" && git pull)
fi

cd "$BACKEND_DIR"
./gradlew bootRun --no-daemon
