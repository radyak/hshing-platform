#!make
include ../.env
export

IMAGE=test-app
REPO=radyak
TAG=latest

default: deploy

prepare.arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

arm32: prepare.arm32
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=arm32v7/node .

dev:
	npm run watch

run:
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=node:8 .
	docker run -p 3000:3000 -e PORT=3000 $(REPO)/$(IMAGE)
	# On Raspberry PI: docker run radyak/test-app

deploy: arm32
	docker tag $(REPO)/$(IMAGE) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)
