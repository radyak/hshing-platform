#!make
include ../.env
export

IMAGE=gateway
REPO=radyak
TAG=latest

default: deploy

prepare.arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

arm32: prepare.arm32
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=arm32v7/node .

tests:
	npm test

tests.dev:
	npm test -- -w
	# npm test -- -w --grep 'lists files recursively'

dev:
	npm run watch

run:
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=node:8 .
	docker run -p 80:80 -p 443:443 -v /home/fvo/tmp/test-mounts:/usr/src/conf -e CONF_DIR=/usr/src/conf -e ENV=dev $(REPO)/$(IMAGE)
	# On Raspberry PI:
	# docker run -p 80:80 -p 443:443 -v /home/pirate/conf:/usr/src/conf -e CONF_DIR=/usr/src/conf radyak/gateway

deploy: arm32
	docker tag $(REPO)/$(IMAGE) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)

config.deploy:
	scp -P $(PORT) .env.conf $(SSH_USER)@$(DOMAIN):/home/pirate/conf/.env.conf
	scp -P $(PORT) .env.key $(SSH_USER)@$(DOMAIN):/home/pirate/conf/.env.key
