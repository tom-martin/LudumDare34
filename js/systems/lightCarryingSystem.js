function LightCarryingSystem() {
	this.lightCarryingEntities = [];
	this.update = function(now, tick) {
		for(var i in this.lightCarryingEntities) {
			var lightCarryingEntity = this.lightCarryingEntities[i];
			var light = lightCarryingEntity.carriesLightComponent.light;
			if(light != null) {
				light.position.copy(lightCarryingEntity.positionComponent.position);
				light.position.z += 1;
			}
		}
	}
}