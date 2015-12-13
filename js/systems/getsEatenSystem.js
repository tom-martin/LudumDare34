var audio  = document.createElement("audio");
var canPlayMP3 = (typeof audio.canPlayType === "function" && audio.canPlayType("audio/mpeg") !== "");

var biteSounds = [];
if(canPlayMP3) {
	biteSounds = [new Audio('sound/bite1.mp3'), new Audio('sound/bite2.mp3'), new Audio('sound/bite3.mp3'), new Audio('sound/bite4.mp3'), new Audio('sound/bite5.mp3')];
} else {
	biteSounds = [new Audio('sound/bite1.ogg'), new Audio('sound/bite2.ogg'), new Audio('sound/bite3.ogg'), new Audio('sound/bite4.ogg'), new Audio('sound/bite5.ogg')];
}

function GetsEatenSystem() {
	this.eatingEntities = [];
	this.edibleEntities = [];

	this.update = function(now, tick) {
		for(var i in this.eatingEntities) {
			var eatingEntity = this.eatingEntities[i];
			if(!eatingEntity.playerComponent.dead && eatingEntity.playerComponent.running) {
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
							biteSounds[Math.floor(Math.random()*biteSounds.length)].play();
						}
					}
				}
			}
		}
	}
}