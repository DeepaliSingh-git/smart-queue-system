# Build stage
FROM maven:3.8.4-openjdk-17 as builder

WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /build/target/smart-queue-management-1.0.0.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.JarLauncher && curl -f http://localhost:8080/api/doctors || exit 1

CMD ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
