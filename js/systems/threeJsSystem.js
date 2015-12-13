function ThreeJsSystem() {
	this.threeJsEntities = [];

	this.update = function(now, tick) {
		for(var i in this.threeJsEntities) {
			var entity = this.threeJsEntities[i];
			entity.threeJsComponent.mesh.position.copy(entity.positionComponent.position);
			entity.threeJsComponent.mesh.rotation.z = entity.positionComponent.rotation;
		}
	}
}