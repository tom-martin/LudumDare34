function PositionComponent(entity) {
	this.position = new THREE.Vector3(0, 0, 0);
	this.rotation = 0;

	this.moveBy = function(x, y, z) {
		this.moveTo(this.position.x + x, this.position.y + y, this.position.z + z);
	}

	this.moveTo = function(x, y, z) {
		this.position.set(x, y, z);
	}
}