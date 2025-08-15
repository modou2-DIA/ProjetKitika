# Utilisez une image de base qui contient Java 17 LTS.
FROM eclipse-temurin:17-jdk-focal

# Définissez le répertoire de travail dans le conteneur.
WORKDIR /app

# Copiez le fichier gradlew et le dossier 'gradle' contenant le wrapper.
# C'est la ligne CRUCIALE qui manquait.
COPY gradlew .
COPY gradle ./gradle

# Copiez les fichiers de configuration Gradle et les sources.
COPY settings.gradle .
COPY build.gradle .
COPY src src

# Rendez le script gradlew exécutable.
RUN chmod +x gradlew

# Exécutez la commande de build Gradle.
# L'option --no-daemon est essentielle pour un build propre dans un conteneur.
RUN ./gradlew assemble --no-daemon

# Exposez le port par défaut de votre application Spring Boot.
EXPOSE 8080

# Définissez la commande pour exécuter le fichier JAR une fois le build terminé.
CMD ["java", "-jar", "./build/libs/KitikaBackend-0.0.1-SNAPSHOT.jar"]
