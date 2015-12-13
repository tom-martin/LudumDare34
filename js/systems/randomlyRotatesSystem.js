function RandomlyRotatesSystem() {
	this.randomlyRotateEntities = [];
	
	this.update = function(now, tick) {
		for(var i in this.randomlyRotateEntities) {
			var randomlyRotateEntity = this.randomlyRotateEntities[i];

			var randomlyRotatesComponent = randomlyRotateEntity.randomlyRotatesComponent;
			var positionComponent = randomlyRotateEntity.positionComponent;
			if(Math.random() < 0.01) {
				randomlyRotatesComponent.rotatingLeft = !randomlyRotatesComponent.rotatingLeft;
			}

			if(Math.random() < 0.01) {
				randomlyRotatesComponent.rotatingRight = !randomlyRotatesComponent.rotatingRight;
			}

			if(randomlyRotatesComponent.rotatingLeft) {
				positionComponent.rotation += (tick * randomlyRotatesComponent.rotationSpeed);
			}

			if(randomlyRotatesComponent.rotatingRight) {
				positionComponent.rotation -= (tick * randomlyRotatesComponent.rotationSpeed);
			}
		}
	}
}