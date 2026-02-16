FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start command - allow external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
