#!/bin/bash
set -e

BACKEND_DIR="backend"
PORT=9000
REPO_URL="https://github.com/uqbar-project/eg-tareas-springboot-kotlin"

if [ ! -d "$BACKEND_DIR/.git" ]; then
  echo "Cloning backend into $BACKEND_DIR..."
  git clone "$REPO_URL" "$BACKEND_DIR"
else
  echo "Updating backend in $BACKEND_DIR..."
  (
    cd "$BACKEND_DIR"
    git fetch origin
    # La rama default del remoto puede cambiar (p.ej. de master a main):
    # preguntamos cuál es y la seguimos en vez de asumir una fija.
    git remote set-head origin -a
    DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@')
    echo "Remote default branch is $DEFAULT_BRANCH"
    git checkout "$DEFAULT_BRANCH"
    # El clon es descartable (solo sirve para levantar el backend en e2e),
    # así que sincronizamos exacto con el remoto sin intentar merges.
    git reset --hard "origin/$DEFAULT_BRANCH"
  )
fi

cd "$BACKEND_DIR"
# exec: reemplaza el proceso bash por gradle para que las señales
# (SIGINT/SIGTERM que envía start-server-and-test al terminar los tests)
# lleguen directo a Gradle/JVM y el apagado sea limpio.
# Sin exec, el bash intermediario muere con 128+SIGINT=130 y ese código
# es el que veías aunque el test hubiera pasado (1 passed).
exec ./gradlew bootRun --no-daemon
