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
# exec: reemplaza el proceso bash por gradle para que las señales
# (SIGINT/SIGTERM que envía start-server-and-test al terminar los tests)
# lleguen directo a Gradle/JVM y el apagado sea limpio.
# Sin exec, el bash intermediario muere con 128+SIGINT=130 y ese código
# es el que veías aunque el test hubiera pasado (1 passed).
exec ./gradlew bootRun --no-daemon
