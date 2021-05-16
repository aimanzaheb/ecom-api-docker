FROM node:15
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install

ARG IMAGE_ENV
RUN if [ "$IMAGE_ENV" = "development" ]; \
  then npm install; \
  else npm install --only=production; \
  fi

COPY ./ ./
ENV PORT 5000
EXPOSE $PORT
CMD ["node", "index.js"]