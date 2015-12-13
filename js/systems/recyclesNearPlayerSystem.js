function RecyclesNearPlayerSystem() {
	this.playerEntity = null;
	this.recyclableEntities = [];

	this.recyclableDistance = 100;

	this.update = function(now, tick) {
		var playerPosition = this.playerEntity.positionComponent.position;
		for(var i in this.recyclableEntities) {
			var recyclableEntity = this.recyclableEntities[i];
			var recyclablePosition = recyclableEntity.positionComponent.position;
			if(Math.abs(recyclablePosition.x - playerPosition.x) > this.recyclableDistance ||
			   Math.abs(recyclablePosition.y - playerPosition.y) > this.recyclableDistance ||
			   !recyclableEntity.spriteComponent.sprite.mesh.visible) {
				recyclablePosition.x = playerPosition.x + (Math.random()*this.recyclableDistance*x)-this.recyclableDistance;
				recyclablePosition.y = playerPosition.y + (Math.random()*this.recyclableDistance*y)-this.recyclableDistance;
				recyclableEntity.spriteComponent.sprite.mesh.visible = true;
			}
		}
	}
}