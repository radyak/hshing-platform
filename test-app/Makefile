
IMAGE = test-app
REPO = radyak
TAG = latest

default: test-app.deploy

prepare.arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

test-app.arm32: prepare.arm32
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=arm32v7/node .

test-app.dev:
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=node:8 .

test-app.run: test-app.dev
	docker run -p 3000:3000 -e PORT=3000 $(REPO)/$(IMAGE)
	# On Raspberry PI:
	# docker run -p 80:80 -p 443:443 -v /home/pirate/conf:/usr/src/conf -e CONF_DIR=/usr/src/conf radyak/test-app

test-app.deploy: test-app.arm32
	docker tag $(REPO)/$(IMAGE) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)
