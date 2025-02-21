# Use Node JS v16.x as base image
FROM node:latest

# Create server directory inside image
WORKDIR /app


# Copy only the package.json and package-lock.json first to leverage Docker's cache
COPY package*.json ./


# Copy the source code
COPY . .

# Install dependencies
RUN npm install

# Expose server port
EXPOSE 3000

# Set the environment to production for Railway (optional, depending on your setup)
ENV NODE_ENV=production

# Start server using npm script
CMD [ "npm", "run", "start" ]