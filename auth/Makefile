#!make
include ../.build-parameters
include .build-parameters
export

default: auth.deploy

prepare.arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

auth.arm32: prepare.arm32
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=arm32v7/node .

auth.test:
	npm test

auth.dev:
	npm run watch
	#docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=node:8 .

auth.run: auth.dev
	docker run -p 3000:3000 $(REPO)/$(IMAGE)
	# On Raspberry PI: docker run radyak/auth

auth.deploy: auth.arm32
	docker tag $(REPO)/$(IMAGE) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)

auth.test:
	npm test