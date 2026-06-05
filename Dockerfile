FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy package descriptors & install production dependencies cleanly
COPY package*.json ./
RUN npm ci --omit=dev

# Install Python and dependencies
RUN apt-get update && apt-get install -y python3 python3-pip psmisc && rm -rf /var/lib/apt/lists/*
RUN ln -sf python3 /usr/bin/python

# Copy Python requirements and install
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy compiled backend & frontend assets
COPY --from=builder /app/dist ./dist
# Copy python scripts and scripts directory
COPY --from=builder /app/*.py ./
# Copy scripts dir if it exists
COPY --from=builder /app/scripts ./scripts/ 
# Copy firebase configs optionally if they are present at the root
COPY --from=builder /app/firebase-applet-config.json* ./

EXPOSE 3000

CMD ["node", "dist/server.cjs"]

