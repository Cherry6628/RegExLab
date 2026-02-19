# ==============================
# Stage 1 — Compile Java Source
# ==============================
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy entire project
COPY src ./src

# Create build directory
RUN mkdir -p build/classes

# Compile Java source files
RUN javac \
    -encoding UTF-8 \
    -cp "src/main/webapp/WEB-INF/lib/*" \
    -d build/classes \
    $(find src/main/java -name "*.java")


# ==============================
# Stage 2 — Tomcat Runtime
# ==============================
FROM tomcat:10.1
RUN rm -rf /usr/local/tomcat/webapps/*
COPY src/main/webapp /usr/local/tomcat/webapps/ROOT
COPY --from=builder /app/build/classes \
    /usr/local/tomcat/webapps/ROOT/WEB-INF/classes

EXPOSE 8080

CMD ["catalina.sh", "run"]
