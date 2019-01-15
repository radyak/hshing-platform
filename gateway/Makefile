#!make
include ../.build-parameters
include .build-parameters
export

default: gateway.deploy

prepare.arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

gateway.arm32: prepare.arm32
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=arm32v7/node .

gateway.test:
	npm test

gateway.dev:
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=node:8 .

gateway.run: gateway.dev
	docker run -p 80:80 -p 443:443 -v /home/fvo/tmp/test-mounts:/usr/src/conf -e CONF_DIR=/usr/src/conf -e ENV=dev $(REPO)/$(IMAGE)
	# On Raspberry PI:
	# docker run -p 80:80 -p 443:443 -v /home/pirate/conf:/usr/src/conf -e CONF_DIR=/usr/src/conf radyak/gateway

gateway.deploy: gateway.arm32
	docker tag $(REPO)/$(IMAGE) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)

gateway-config.deploy:
	scp -P $(PORT) .env.conf $(SSH_USER)@$(DOMAIN):/home/pirate/conf/.env.conf
	scp -P $(PORT) .env.key $(SSH_USER)@$(DOMAIN):/home/pirate/conf/.env.key
