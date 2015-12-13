function ParticleSystem() {
	this.particleEntities = [];
	this.newParticlePoints = [];
	var nextParticle = 0;
	this.update = function(now, tick) {
		for(var i in this.newParticlePoints) {
			var point = this.newParticlePoints[i];
			var numberOfPoints = 5+(Math.random()*20);
			for(var j = 0; j < numberOfPoints; j++) {
				var particleEntity = this.particleEntities[nextParticle];
				particleEntity.positionComponent.position.copy(point);
				particleEntity.threeJsComponent.mesh.visible = true;

				var newX = 10+(Math.random()*20);
				var newY = 10+(Math.random()*20);

				if(Math.random() < 0.5) {
					newX *=-1;
				}

				if(Math.random() < 0.5) {
					newY *=-1;
				}

				particleEntity.particleComponent.moveVector.set(newX, newY, 0);
				particleEntity.particleComponent.rotationSpeed =(Math.random()*Math.PI*4)-(Math.PI*2);


				nextParticle++;
				if(nextParticle >= this.particleEntities.length) {
					nextParticle = 0;
				}
			}
		}

		this.newParticlePoints = [];

		for(var i in this.particleEntities) {
			var particleEntity = this.particleEntities[i];

			if(particleEntity.threeJsComponent.mesh.visible) {
				particleEntity.positionComponent.position.x += particleEntity.particleComponent.moveVector.x*tick;
				particleEntity.positionComponent.position.y += particleEntity.particleComponent.moveVector.y*tick;
				particleEntity.particleComponent.moveVector.y-=(tick*30);
				if(particleEntity.particleComponent.moveVector.x > 0) {
					particleEntity.particleComponent.moveVector.x = Math.max(0, particleEntity.particleComponent.moveVector.x -(tick*30));
				} else {
					particleEntity.particleComponent.moveVector.x = Math.min(0, particleEntity.particleComponent.moveVector.x + (tick*30));
				}
				particleEntity.positionComponent.rotation += (tick * particleEntity.particleComponent.rotationSpeed);
			}
		}
	}
}