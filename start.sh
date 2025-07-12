#!/bin/sh

# Print Node.js version for debugging
node --version
echo "Current working directory: $(pwd)"
echo "Listing dist directory:"
ls -la dist

# Check if this is the first run
if [ -z "$FIRST_RUN_COMPLETE" ]; then
  echo "First run detected, running seeders..."
  if [ -f "dist/database/seeds/first-run-seed.js" ]; then
    node dist/database/seeds/first-run-seed.js
    echo "Seeders completed"
  else
    echo "Warning: first-run-seed.js not found, skipping seeders"
    # List the database/seeds directory to see what's there
    echo "Contents of dist/database/seeds (if it exists):"
    ls -la dist/database/seeds || echo "Seeds directory not found"
  fi
fi

# Start the application
node dist/main.js
