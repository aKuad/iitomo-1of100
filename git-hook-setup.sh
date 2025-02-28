#!/usr/bin/env sh
#
# Easy setting up of commit-msg git hook
#
# Author: aKuad
#

if [ -e .git/hooks/pre-commit ] || [ -e .git/hooks/commit-msg ]; then
  echo "pre-commit or commit-msg hook is already exist."
  echo -n "Overwrite? [Y/n]: "
  read user_in

  if [ "$user_in" != "Y" ] && [ "$user_in" != "y" ]; then
    echo "Aborted"
    exit 1
  fi
fi

cp assets/pre-commit assets/commit-msg .git/hooks/
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg

echo "Hook setting up successfully."
