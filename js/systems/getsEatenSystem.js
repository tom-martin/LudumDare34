function GetsEatenSystem() {
	this.eatingEntities = [];
	this.edibleEntities = [];

	this.update = function(now, tick) {
		for(var i in this.eatingEntities) {
			var eatingEntity = this.eatingEntities[i];
			var eatingPositionComponent = eatingEntity.positionComponent;
			for(var j in this.edibleEntities) {
				var edibleEntity = this.edibleEntities[j];

				if(eatingEntity != edibleEntity) {
					var ediblePositionComponent = edibleEntity.positionComponent;
					if(!(eatingPositionComponent.position.x - 2 > ediblePositionComponent.position.x + 2 ||
						eatingPositionComponent.position.x + 2 < ediblePositionComponent.position.x - 2 ||
						eatingPositionComponent.position.y - 2 > ediblePositionComponent.position.y + 2 ||
						eatingPositionComponent.position.y + 2 < ediblePositionComponent.position.y - 2)) {
						edibleEntity.spriteComponent.sprite.mesh.visible = false;
						eatingEntity.playerComponent.fliesEaten ++;
						console.log(eatingEntity.playerComponent.fliesEaten);
					}
				}
			}
		}
	}
}