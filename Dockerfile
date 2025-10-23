# STAGE 1: Build Stage
# Use an official Node.js runtime as a parent image.
# Using 18-alpine for a smaller, more secure base.
FROM node:18-alpine AS build
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first
# This caches our dependencies, speeding up future builds
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
# This creates the .next folder
RUN npm run build

# STAGE 2: Production Stage
# Use a smaller base image for the final container
FROM node:18-alpine

WORKDIR /app

# We only need the built app and the necessary node_modules
# Copy the built .next folder from the 'build' stage
COPY --from=build /app/.next ./.next

# Copy the node_modules
# We'll prune the devDependencies to make the image smaller
COPY --from=build /app/node_modules ./node_modules

# Copy package.json to run 'npm start'
COPY package.json ./

# Copy the public and .next/static folders
# Next.js needs these to serve static files
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static


# Expose the port the app runs on (Next.js default is 3000)
EXPOSE 3000

# The command to run when the container starts
CMD ["npm", "start"]
