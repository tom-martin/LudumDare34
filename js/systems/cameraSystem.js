function CameraSystem() {
	this.cameraEntity = null;

	this.update = function(now, tick) {
		if(this.cameraEntity != null) {
			var cameraComponent = this.cameraEntity.cameraComponent;
			var threeCamera = cameraComponent.threeCamera;

			threeCamera.position.copy(cameraEntity.positionComponent.position);
			cameraComponent.offset.z = Math.min(96, cameraComponent.offset.z+tick);

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