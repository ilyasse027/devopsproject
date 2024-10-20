# Build backend
FROM maven:3.8.3-openjdk-11 AS backend-build
WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Build frontend
FROM node:14 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/public ./public
COPY frontend/src ./src
RUN npm run build

# Final image
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
COPY --from=frontend-build /app/frontend/build ./frontend/build
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]