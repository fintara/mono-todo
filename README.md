Mono Todo
=========

![Java CI](https://github.com/fintara/mono-todo/workflows/Java%20CI/badge.svg)

Example todo app featuring 
[http4k](https://github.com/http4k/http4k) backend, 
[React](https://github.com/facebook/create-react-app) frontend with 
[Overmind](https://github.com/cerebral/overmind/) state management.

## Setup
* frontend:
    * `./gradlew :todo-frontend:yarn_install`

## Tests

`./gradlew test`

* backend coverage:
    * `./gradlew :todo-backend:clean :todo-backend:test :todo-backend:jacocoTestReport`
    * coverage report is in `./todo-backend/build/jacoco`
        * note that JaCoCo does not cover Kotlin's inline functions (see [jacoco/jacoco#654](https://github.com/jacoco/jacoco/issues/654))
* frontend coverage:
    * `./gradlew :todo-frontend:test`
    * coverage report is in `./todo-frontend/coverage`
