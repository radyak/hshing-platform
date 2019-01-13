
IMAGE = mongodb
REPO = radyak
TAG = latest

default: mongodb.deploy

prepare.arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

mongodb.arm32: prepare.arm32
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=nonoroazoro/rpi-mongo .

mongodb.dev:
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=mongo .

mongodb.run: mongodb.dev
	docker run $(REPO)/$(IMAGE)

mongodb.deploy: mongodb.arm32
	docker tag $(REPO)/$(IMAGE) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)