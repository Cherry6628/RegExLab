FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY src ./src
RUN mkdir -p build/classes
RUN JARS=$(echo src/main/webapp/WEB-INF/lib/*.jar | tr ' ' ':') && \
    javac \
    -encoding UTF-8 \
    -cp "$JARS" \
    -d build/classes \
    $(find src/main/java -name "*.java")
FROM tomcat:10.1
RUN rm -rf /usr/local/tomcat/webapps/*
COPY src/main/webapp /usr/local/tomcat/webapps/ROOT
COPY --from=builder /app/build/classes \
    /usr/local/tomcat/webapps/ROOT/WEB-INF/classes
EXPOSE 8080
CMD ["catalina.sh", "run"]
