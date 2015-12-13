function CameraSystem() {
	this.cameraEntity = null;

	var targetZOffset = 0;

	this.update = function(now, tick) {
		if(this.cameraEntity != null) {
			var cameraComponent = this.cameraEntity.cameraComponent;
			var threeCamera = cameraComponent.threeCamera;

			threeCamera.position.copy(cameraEntity.positionComponent.position);
			// hack
			targetZOffset = Math.min(96, 24+cameraComponent.lookAtEntity.playerComponent.moveSpeed);
			if(cameraComponent.offset.z > targetZOffset) {
				cameraComponent.offset.z = Math.max(targetZOffset, cameraComponent.offset.z-(tick*2));
			} else {
				cameraComponent.offset.z = Math.min(targetZOffset, cameraComponent.offset.z+(tick*2));
			}

			if(cameraComponent.lookAtEntity != null) {
				var lookAtPosition = cameraComponent.lookAtEntity.positionComponent.position;
				cameraEntity.positionComponent.position.copy(cameraComponent.offset);
				cameraEntity.positionComponent.position.x += lookAtPosition.x;
				cameraEntity.positionComponent.position.y += lookAtPosition.y;
				cameraEntity.positionComponent.position.z += lookAtPosition.z;
				threeCamera.position.copy(cameraEntity.positionComponent.position);
				threeCamera.lookAt(lookAtPosition);
			}
		}
	}
}