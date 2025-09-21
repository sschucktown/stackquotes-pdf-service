FROM node:20-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
  wget gnupg ca-certificates \
  fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 \
  libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 \
  libgcc1 libglib2.0-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 \
  libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
  libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
  libxtst6 lsb-release xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Create app dir
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
