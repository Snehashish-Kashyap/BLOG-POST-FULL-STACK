# ---- Build Stage ----
FROM node:20-bullseye AS build
WORKDIR /app

# Disable Rolldown globally inside the container
ENV VITE_RUST_ROLLUP=0

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
