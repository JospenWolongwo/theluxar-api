#!/bin/sh

# Print environment information for debugging
node --version
echo "Current working directory: $(pwd)"
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..." # Only print beginning of connection string for security

# Check database environment variables
echo "===== Database Environment Variables ===="
if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL is set"
else
  echo "WARNING: DATABASE_URL is not set"
fi

if [ -n "$DB_HOST" ]; then 
  echo "DB_HOST is set to: $DB_HOST"
else
  echo "WARNING: DB_HOST is not set"
fi

if [ -n "$DB_PORT" ]; then 
  echo "DB_PORT is set"
else
  echo "WARNING: DB_PORT is not set"
fi

if [ -n "$DB_USER" ]; then 
  echo "DB_USER is set"
else
  echo "WARNING: DB_USER is not set"
fi

if [ -n "$DB_NAME" ]; then 
  echo "DB_NAME is set"
else
  echo "WARNING: DB_NAME is not set"
fi

if [ -n "$DB_PASSWORD" ]; then 
  echo "DB_PASSWORD is set (value hidden)"
else
  echo "WARNING: DB_PASSWORD is not set"
fi
echo "===== End Database Environment Variables ===="

# Find the first-run seed script
SEED_SCRIPT=""
echo "Searching for first-run-seed.js..."
for LOCATION in "dist/src/database/seeds/first-run-seed.js" "dist/database/seeds/first-run-seed.js" "src/database/seeds/first-run-seed.js"
do
  if [ -f "$LOCATION" ]; then
    SEED_SCRIPT="$LOCATION"
    echo "✅ Found seed script at: $SEED_SCRIPT"
    break
  fi
done

# Run the seed script with detailed error handling
if [ -n "$SEED_SCRIPT" ]; then
  echo "🌱 Running database seed script from $SEED_SCRIPT"
  echo "-------- SEED SCRIPT START --------"
  # Run with --unhandled-rejections=strict to get full stack traces
  NODE_OPTIONS="--unhandled-rejections=strict" node "$SEED_SCRIPT" 2>&1 || { 
    echo "❌ SEED SCRIPT FAILED WITH EXIT CODE $?"
    echo "Checking database connection..."
    # Add a simple database connection test
    echo "const { Client } = require('pg'); 
    async function testConnection() {
      const client = new Client({
        connectionString: process.env.DATABASE_URL || {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
        }
      });
      try {
        await client.connect();
        console.log('✅ Successfully connected to database');
        const result = await client.query('SELECT NOW()');
        console.log('Database time:', result.rows[0].now);
        await client.end();
      } catch (err) {
        console.error('❌ Database connection failed:', err.message);
      }
    }
    testConnection();" > test-db-connection.js
    
    node test-db-connection.js
    
    # Continue with application startup even if seed fails
    echo "Continuing with application startup despite seed failure"
  }
  echo "-------- SEED SCRIPT END --------"
else
  echo "❌ WARNING: Could not find first-run-seed.js in any expected location"
  echo "Available seed scripts:"
  find . -name "*seed*.js" || echo "No seed scripts found"
fi

# Directly check for main.js in various possible locations
echo "Checking for main.js in various locations:"
find ./dist -name "main.js" || echo "main.js not found in dist"

# Check exact structure of dist directory
echo "Structure of dist directory:"
ls -la dist/

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
