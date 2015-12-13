function MovesByRotationSystem() {
	this.movedByRotationEntities = [];
	this.moveVector = new THREE.Vector3();
	this.Z = new THREE.Vector3(0, 0, 1);
	
	this.update = function(now, tick) {
		for(var i in this.movedByRotationEntities) {
			var movedByRotationEntity = this.movedByRotationEntities[i];

			var positionComponent = movedByRotationEntity.positionComponent;

			this.moveVector.set(0, 1, 0);
			this.moveVector.applyAxisAngle(this.Z, positionComponent.rotation);

			positionComponent.position.x += this.moveVector.x*tick*8;
			positionComponent.position.y += this.moveVector.y*tick*8;
			positionComponent.position.z += this.moveVector.z*tick*8;
		}
	}
}