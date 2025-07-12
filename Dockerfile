FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy app source
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Expose port (Back4app will assign a port via PORT env var)
EXPOSE 3000
EXPOSE $PORT

# Create startup script
RUN echo '#!/bin/sh\n\n# Check if this is the first run\nif [ -z "$FIRST_RUN_COMPLETE" ]; then\n  echo "First run detected, running seeders..."\n  node dist/database/seeds/first-run-seed.js\n  echo "Seeders completed"\nfi\n\n# Start the application\nnode dist/main.js' > /app/start.sh && chmod +x /app/start.sh

# Run the app
CMD ["/app/start.sh"]
