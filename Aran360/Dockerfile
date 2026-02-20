FROM eclipse-temurin:21-jdk
RUN apt update && apt install -y docker.io
WORKDIR /app
COPY LabRuntimeServer.class .
COPY BackEnd/src/main/webapp/WEB-INF/dockers/*.tar /labs/
CMD ["java", "LabRuntimeServer"]