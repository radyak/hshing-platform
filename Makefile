#!make
include .build-parameters
export

default: cluster-config.deploy

cluster-config.deploy:
	scp -P $(PORT) docker-compose.RPI.yml $(SSH_USER)@$(DOMAIN):docker-compose.yml

deploy-all: cluster-config.deploy
