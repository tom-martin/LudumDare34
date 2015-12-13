var audio  = document.createElement("audio");
var canPlayMP3 = (typeof audio.canPlayType === "function" && audio.canPlayType("audio/mpeg") !== "");

var deathSounds = [];
if(canPlayMP3) {
	deathSounds = [new Audio('sound/death1.mp3')];
} else {
	deathSounds = [new Audio('sound/death1.ogg')];
}

function HazardSystem() {
	this.playerEntity = null;
	this.hazardsToAdd = [];
	this.hazards = [];

	this.staticHazards = [];

	this.update = function(now, tick) {
		if(this.playerEntity != null && this.playerEntity.playerComponent.running && !this.playerEntity.playerComponent.dead) {
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
					if(!this.playerEntity.playerComponent.dead) deathSounds[Math.floor(Math.random()*deathSounds.length)].play();
					this.playerEntity.playerComponent.dead = true;
				}
			}

			for(var i in this.staticHazards) {
				var hazard = this.staticHazards[i];

				if(!(playerPosition.x - 0.5 > hazard.x + hazard.halfWidth ||
						playerPosition.x + 0.5 < hazard.x - hazard.halfWidth ||
						playerPosition.y - 0.5 > hazard.y + hazard.halfHeight ||
						playerPosition.y + 0.5 < hazard.y - hazard.halfHeight)) {
					if(!this.playerEntity.playerComponent.dead) deathSounds[Math.floor(Math.random()*deathSounds.length)].play();
					this.playerEntity.playerComponent.dead = true;
				}
			}
		}
	}
}