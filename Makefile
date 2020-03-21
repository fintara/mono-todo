all: sync jobs deploy

sync:
	git pull

jobs: job-backend job-frontend

job-backend:
	./gradlew-docker :todo-backend:clean :todo-backend:build -x :todo-backend:test
	(cd todo-backend && docker build -t mono-todo-backend -f Dockerfile .)

job-frontend:
	./gradlew :todo-frontend:yarn_install :todo-frontend:yarn_build
	(cd todo-frontend && docker build -t mono-todo-frontend -f Dockerfile .)

deploy:
	docker stack deploy -c docker-compose.yml mono-todo

stop:
	docker stack rm mono-todo || echo 'Already stopped'