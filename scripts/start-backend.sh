#!/bin/bash
set -e

BACKEND_DIR="backend"
PORT=9000
REPO_URL="https://github.com/uqbar-project/eg-tareas-springboot-kotlin"

if [ ! -d "$BACKEND_DIR/.git" ]; then
  echo "Cloning backend into $BACKEND_DIR..."
  git clone "$REPO_URL" "$BACKEND_DIR"
# else
#   echo "Updating backend in $BACKEND_DIR..."
#   (
#     cd "$BACKEND_DIR"
#     git fetch origin
#     # Get default branch
#     git remote set-head origin -a
#     DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@')
#     echo "Remote default branch is $DEFAULT_BRANCH"
#     git checkout "$DEFAULT_BRANCH"
#     # Discard any local changes, it should work with the current branch
#     git reset --hard "origin/$DEFAULT_BRANCH"
#   )
fi

cd "$BACKEND_DIR"
# exec: replaces the bash process with gradle so that signals
# (SIGINT/SIGTERM sent by start-server-and-test once the tests finish)
# reach Gradle/JVM directly and the shutdown is clean.
# Without exec, the intermediate bash dies with 128+SIGINT=130, and that
# exit code is the one you saw even when the test had passed (1 passed).
exec ./gradlew bootRun --no-daemon
