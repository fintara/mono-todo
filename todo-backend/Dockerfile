FROM openjdk:11-jdk-slim

WORKDIR /app

COPY ./build/libs/*.jar /app/web.jar

EXPOSE 8080

ENTRYPOINT sleep 15 && exec java -jar \
            -Djava.security.egd=file:/dev/./urandom \
            -Xmx128m -Xss1024k \
            -Dserver.port=8080 \
            -Duser.timezone=$TIMEZONE \
            /app/web.jar
