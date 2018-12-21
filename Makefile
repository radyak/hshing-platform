
IMAGE = management
REPO = andnowayak
TAG = latest

default: management.deploy

prepare.arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset

management.arm32: prepare.arm32
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=arm32v7/node ./management/

management.dev:
	docker build -t $(REPO)/$(IMAGE) --build-arg BASE_IMAGE=node:8 ./management/

management.run: management.dev
	docker run -p 80:80 -p 443:443 -v /home/fvo/tmp/test-mounts:/usr/src/app/test-mounts $(REPO)/$(IMAGE)
	# On Raspberry PI:
	# docker run -p 80:80 -p 443:443 -v /home/pirate/conf:/usr/src/conf -e CONF_DIR=/usr/src/conf andnowayak/management

management.deploy: management.arm32
	docker tag $(REPO)/$(IMAGE) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)