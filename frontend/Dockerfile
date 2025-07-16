# Use official Node.js 24 image as build environment
FROM node:24.0.2 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build Angular app in production mode
RUN npm run build -- --configuration production

# Use a lightweight Node.js image to serve built files
FROM node:24.0.2-alpine

WORKDIR /app

# Install 'serve' globally
RUN npm install -g serve

# Copy built Angular files from build stage
COPY --from=build /app/dist/frontend/browser ./dist

# Expose port 80 for serving
EXPOSE 80

# Serve the Angular app on port 80
CMD ["serve", "-s", "dist", "-l", "80"]