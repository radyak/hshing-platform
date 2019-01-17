#!make
include .build-parameters
export

default: cluster-config.deploy

cluster-config.deploy:
	scp -P $(PORT) docker-compose.RPI.yml $(SSH_USER)@$(DOMAIN):docker-compose.yml

deploy-all: cluster-config.deploy

mongoclient:
	docker run -d -p 3000:3000 --network host mongoclient/mongoclient