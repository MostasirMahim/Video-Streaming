# Dockerfile.frontend
FROM node:20-alpine

WORKDIR /app

# Copy and install only frontend
COPY package*.json ./
RUN npm install

COPY . ./

# Set the VITE port if needed
ENV VITE_PORT=3000
EXPOSE ${VITE_PORT}

CMD ["npm", "run", "dev"]
