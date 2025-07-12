#!/bin/sh

# Check if this is the first run
if [ -z "$FIRST_RUN_COMPLETE" ]; then
  echo "First run detected, running seeders..."
  node dist/database/seeds/first-run-seed.js
  echo "Seeders completed"
fi

# Start the application
node dist/main.js
