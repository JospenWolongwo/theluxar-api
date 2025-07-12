#!/bin/sh

# Print Node.js version for debugging
node --version
echo "Current working directory: $(pwd)"

# Directly check for main.js in various possible locations
echo "Checking for main.js in various locations:"
ls -la dist/ | grep main.js || echo "No main.js in dist/"
ls -la dist/src/ | grep main.js || echo "No main.js in dist/src/"
ls -la | grep main.js || echo "No main.js in root dir"

# Check exact structure of dist directory
echo "Structure of dist directory:"
ls -la dist/

# Look for any main.js file anywhere
echo "Searching for main.js anywhere:"
find . -name "main.js" || echo "main.js not found anywhere"

# Try to run the application from different possible locations
if [ -f "dist/main.js" ]; then
  echo "Found dist/main.js, attempting to run"
  NODE_OPTIONS="--trace-warnings" node dist/main.js
elif [ -f "dist/src/main.js" ]; then
  echo "Found dist/src/main.js, attempting to run"
  NODE_OPTIONS="--trace-warnings" node dist/src/main.js
elif [ -f "main.js" ]; then
  echo "Found ./main.js, attempting to run"
  NODE_OPTIONS="--trace-warnings" node main.js
else
  echo "ERROR: main.js not found in expected locations!"
  echo "Contents of package.json build script:"
  cat package.json | grep -A 3 "\"build\":"
  exit 1
fi
