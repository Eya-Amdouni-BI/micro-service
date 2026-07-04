# Image JDK 17 utilisee pour compiler l'application.
FROM eclipse-temurin:17-jdk-alpine AS build

# Repertoire de travail dans l'image de build.
WORKDIR /app

# Copie le wrapper Maven pour construire sans Maven installe sur la machine hote.
COPY mvnw mvnw.cmd ./
COPY .mvn .mvn

# Copie le pom.xml et telecharge les dependances pour profiter du cache Docker.
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B

# Copie le code source apres les dependances pour eviter de les retelecharger a chaque changement de code.
COPY src ./src

# Compile l'application et genere le fichier JAR sans executer les tests.
RUN ./mvnw clean package -DskipTests

# Image JRE 17 plus legere utilisee uniquement pour l'execution.
FROM eclipse-temurin:17-jre-alpine

# Repertoire de travail dans l'image finale.
WORKDIR /app

# Copie le JAR genere depuis l'etape de build vers l'image finale.
COPY --from=build /app/target/diet_microservice-0.0.1-SNAPSHOT.jar app.jar

# Expose le port du conteneur. A synchroniser avec server.port si le port applicatif change.
EXPOSE 8080

# Commande lancee au demarrage du conteneur.
ENTRYPOINT ["java", "-jar", "app.jar"]
