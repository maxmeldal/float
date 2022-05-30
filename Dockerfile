FROM openjdk:17-alpine
WORKDIR /
ADD ./target/hovedopgave-0.0.1-SNAPSHOT.jar hovedopgave-0.0.1-SNAPSHOT.jar
EXPOSE 8080
CMD java - jar hovedopgave-0.0.1-SNAPSHOT.jar