# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn 

# Copy the rest of the application code
COPY . .

# Set the command to run your tests
CMD ["yarn", "test"]