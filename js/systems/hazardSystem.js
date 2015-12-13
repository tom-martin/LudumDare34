function HazardSystem() {
	this.playerEntity = null;
	this.hazardsToAdd = [];
	this.hazards = [];

	this.update = function(now, tick) {
		if(this.playerEntity != null) {
			var playerPosition = this.playerEntity.positionComponent.position;

			var newHazardsToAdd = [];
			for(var i in this.hazardsToAdd) {
				var hazard = this.hazardsToAdd[i];

				if((playerPosition.x - 2 > hazard.x + 8 ||
					playerPosition.x + 2 < hazard.x - 8 ||
					playerPosition.y - 2 > hazard.y + 8 ||
					playerPosition.y + 2 < hazard.y - 8)) {
					this.hazards.push(hazard);
				} else {
					newHazardsToAdd.push(hazard)
				}
			}

			this.hazardsToAdd = newHazardsToAdd;

			for(var i in this.hazards) {
				var hazard = this.hazards[i];

				if(!(playerPosition.x - 1 > hazard.x + 0.5 ||
						playerPosition.x + 1 < hazard.x - 0.5 ||
						playerPosition.y - 1 > hazard.y + 0.5 ||
						playerPosition.y + 1 < hazard.y - 0.5)) {
					this.playerEntity.playerComponent.dead = true;
				}
			}
		}
	}
}