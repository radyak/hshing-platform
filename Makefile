#!make
include .env
export

cluster-config.deploy:
	scp -P $(PORT) docker-compose.RPI.yml $(SSH_USER)@$(DOMAIN):docker-compose.yml

deploy: cluster-config.deploy

dev.cluster:
	docker-compose up --build

dev.lint:
	npm run lint

# experimental
loop:
	#find - -type f -name Makefile -execdir make dev \; 
	find - -type f -name Makefile -execdir make dev \;
