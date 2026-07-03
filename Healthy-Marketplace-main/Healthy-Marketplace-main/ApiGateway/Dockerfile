# Stage 1: Build the API Gateway using Maven and Java 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml . # copy Maven project descriptor
COPY src ./src # copy source code
RUN mvn clean package -DskipTests # compile and package the app, skip tests for faster build

# Stage 2: Runtime image with only the built jar
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp # standard Spring Boot temp directory
COPY --from=build /app/target/*.jar app.jar # copy jar from build stage
ENTRYPOINT ["java", "-jar", "/app.jar"] # start the gateway
