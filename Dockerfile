FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy production package.json (without @hellocomputing dependencies)
COPY package.prod.json ./package.json

# Create empty .npmrc file to override any existing one
RUN echo "" > .npmrc

# Install only production dependencies
RUN npm install --production --no-package-lock

# Add node_modules/.bin to PATH
ENV PATH="/app/node_modules/.bin:${PATH}"

# Copy app source (but exclude package.json to keep our production version)
COPY --exclude=package.json --exclude=package-lock.json . .

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
