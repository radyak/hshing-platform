
IMAGE = isaliveapp
REPO = andnowayak
TAG = latest

default: isaliveapp.deploy

arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

isaliveapp.arm32: arm32
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=arm32v7/node ./isaliveapp/

isaliveapp.dev:
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=node:8 ./isaliveapp/

isaliveapp.deploy: isaliveapp.arm32
	docker tag $(REPO)/$(IMAGE) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)