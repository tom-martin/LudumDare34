function SpriteSystem() {
	this.spriteEntities = [];

	this.update = function(now, tick) {
		for(var i in this.spriteEntities) {
			var spriteEntity = this.spriteEntities[i];
			var spriteComponent = spriteEntity.spriteComponent;
			var positionComponent = spriteEntity.positionComponent;
			spriteComponent.sprite.mesh.position.copy(positionComponent.position);
			spriteComponent.sprite.mesh.rotation.z = positionComponent.rotation;
			spriteComponent.sprite.update(now);
		}
	}
}