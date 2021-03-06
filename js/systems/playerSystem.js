function PlayerSystem(input, scene, hazardSystem) {
	this.playerEntity = null;

	var createStemTexture = function(i) {
		var stemTexture = THREE.ImageUtils.loadTexture("textures/stem"+i+".png");
		stemTexture.magFilter = THREE.NearestFilter;
	    stemTexture.minFilter = THREE.NearestFilter;
	    stemTexture.generateMipMaps = false;	

	    return stemTexture;
	}

	var stemTextures = [];
	for(var i = 1; i <=3; i++) {
		stemTextures.push(createStemTexture(i));
	}

	
	var stemGeometry = new THREE.PlaneBufferGeometry( 4, 4, 1 );

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: Math.floor(Math.random()*0xffffff) } );
    var debugCube1 = new THREE.Mesh( geometry, material );
    // scene.add( debugCube1 );
    var debugCube2 = new THREE.Mesh( geometry, material );
    // scene.add( debugCube2 );

	var stemCache = [];

	var extendStemCache = function(amount) {
		console.log("Extending stem cache");
		for(var i = 0; i < amount; i++) {
			var stemTexture = stemTextures[Math.floor(Math.random()*stemTextures.length)];
			var stemMaterial = new THREE.MeshLambertMaterial( { 
				map: stemTexture,
				polygonOffsetFactor: 1,
				polygonOffsetUnits: i%2,
				polygonOffset: true,
				transparent: true,
				alphaTest: 0.05
			} );

			var plane = new THREE.Mesh( stemGeometry, stemMaterial );
		    scene.add( plane );
		    plane.visible = false;
		    stemCache.push(plane);
		}	
	}
	extendStemCache(1000);

	
	var stemCacheIndex = 0;

	var stemMaterial = new THREE.MeshLambertMaterial( { 
		map: stemTextures[0],
		polygonOffsetFactor: 1,
		polygonOffsetUnits: 2,
		polygonOffset: true,
		transparent: true,
		alphaTest: 0.05
	} );

	var lastStemPlane = new THREE.Mesh( stemGeometry, stemMaterial );
    scene.add( lastStemPlane );

	var lastStemDrop = new THREE.Vector3(0, -16, 0);
	this.moveVector = new THREE.Vector3();
	this.Z = new THREE.Vector3(0, 0, 1);
	var fallingSpeed = 2;
	this.update = function(now, tick) {
		if(this.playerEntity != null) {
			var positionComponent = this.playerEntity.positionComponent;
			var playerComponent = this.playerEntity.playerComponent;
			if(!playerComponent.dead) {

				if(playerComponent.running) {

					if(input.leftDown) {
						positionComponent.rotation += (tick * playerComponent.rotationSpeed);
					}
					if(input.rightDown) {
						positionComponent.rotation -= (tick * playerComponent.rotationSpeed);
					}

					this.moveVector.set(0, 1, 0);
				
					this.moveVector.applyAxisAngle(this.Z, positionComponent.rotation);
				

					positionComponent.position.x += this.moveVector.x*tick*playerComponent.moveSpeed;
					positionComponent.position.y += this.moveVector.y*tick*playerComponent.moveSpeed;
					positionComponent.position.z += this.moveVector.z*tick*playerComponent.moveSpeed;
				}
			

				lastStemPlane.position.copy(positionComponent.position);
			    lastStemPlane.position.lerp(lastStemDrop, 0.5);
			    var angleRadians = Math.atan2(lastStemDrop.y - positionComponent.position.y, lastStemDrop.x - positionComponent.position.x);
			    lastStemPlane.rotation.z = angleRadians+(Math.PI/2);

			    var distanceToLastStemDropSquared = positionComponent.position.distanceToSquared(lastStemDrop);
			    var distanceNormalised = distanceToLastStemDropSquared/16;
			    lastStemPlane.scale.y = distanceNormalised;

				if(distanceToLastStemDropSquared >= 8) {
				    var plane = stemCache[stemCacheIndex];
				    plane.position.copy(positionComponent.position);
				    plane.position.lerp(lastStemDrop, 0.5);
				    plane.rotation.z = angleRadians+(Math.PI/2);
				    plane.visible = true;

					var hazardLocation = new THREE.Vector3();
				    hazardLocation.copy(plane.position);
				    hazardSystem.hazardsToAdd.push(hazardLocation);

				    stemCacheIndex += 1;   
				    if(stemCacheIndex >= stemCache.length) {
				    	extendStemCache(100);
				    }
				    lastStemDrop.copy(positionComponent.position);
				}

				if(now - playerComponent.lastEatTime < 800) {
					playerEntity.spriteComponent.sprite.setAnim("bite");
				} else {
					playerEntity.spriteComponent.sprite.setAnim("idle");
				}

				playerComponent.moveSpeed = Math.min(48, 6+playerComponent.fliesEaten);
			} else {
				lastStemPlane.visible = false;
				playerEntity.spriteComponent.sprite.setAnim("dead");
				if(positionComponent.position.y > -16) {
					fallingSpeed+=(tick*fallingSpeed);
					positionComponent.rotation -= (tick * Math.min(4, fallingSpeed));
					positionComponent.position.y -= tick*Math.min(64,fallingSpeed);
				} else {
					positionComponent.position.y = -16;
				}
			}
		}
	}
}