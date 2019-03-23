
IMAGE = mongodb
REPO = radyak
TAG = latest

default: deploy

prepare.arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

arm32: prepare.arm32
	docker build -t $(REPO)/$(IMAGE) .

dev: prepare.arm32
	docker build -t $(REPO)/$(IMAGE) .

run: dev
	docker run $(REPO)/$(IMAGE)

deploy: arm32
	docker tag $(REPO)/$(IMAGE) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)