# Dockerfile.backend
FROM node:20-alpine

WORKDIR /app

RUN npm install -g nodemon

# Copy backend code
COPY package*.json ./
RUN npm install

COPY . ./

# Load env and expose port
ENV PORT=5000
EXPOSE ${PORT}

CMD ["npm", "run", "server"]
