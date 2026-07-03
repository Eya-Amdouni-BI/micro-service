# Stage 1: Build the application
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom and source
COPY pom.xml .
COPY src ./src

# Build the jar (layered jar for better caching)
RUN mvn clean package -DskipTests

# Stage 2: Runtime (lightweight)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Expose Config Server port
EXPOSE 8889

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]