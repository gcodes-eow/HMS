# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port Next.js runs on
EXPOSE 8000

# Start the app
CMD ["npm", "run", "dev"]

# If you later want to run this in production, you’ll switch to a multi-stage build that compiles your app and serves it with a lightweight server like node, next start, or even nginx.

# Let me know if you want help writing that production Dockerfile or setting up Prisma migrations inside the container.
