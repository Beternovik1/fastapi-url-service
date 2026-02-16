# Use Node alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port
EXPOSE 5173

# Start the app (MAKE SURE THIS LINE HAS NO # AT THE START)
CMD ["npm", "run", "dev", "--", "--host"]