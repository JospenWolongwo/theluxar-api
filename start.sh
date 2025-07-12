#!/bin/sh

# Print Node.js version for debugging
node --version
echo "Current working directory: $(pwd)"
echo "Listing all directories in dist:"
find dist -type d | sort

echo "Listing all JavaScript files in dist:"
find dist -name "*.js" | sort

echo "Checking if main.js exists:"
if [ -f "dist/main.js" ]; then
  echo "dist/main.js exists, starting application"
  # Start the application with detailed error output
  NODE_OPTIONS="--trace-warnings" node dist/main.js
else
  echo "ERROR: dist/main.js not found!"
  exit 1
fi
