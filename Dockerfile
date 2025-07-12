FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy production package.json (without @hellocomputing dependencies)
COPY package.prod.json ./package.json

# Create empty .npmrc file to override any existing one
RUN echo "" > .npmrc

# Install only production dependencies
RUN npm install --production --no-package-lock

# Install build tools globally
RUN npm install -g @nestjs/cli copyfiles webpack webpack-cli

# Add node_modules/.bin to PATH
ENV PATH="/app/node_modules/.bin:${PATH}"

# Save production package.json to a temp file
RUN cp package.json package.json.prod

# Copy app source
COPY . .

# Restore production package.json
RUN cp package.json.prod package.json

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Expose port (Back4app will assign a port via PORT env var)
EXPOSE 3000
EXPOSE $PORT

# Copy and make startup script executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Run the app
CMD ["/app/start.sh"]
