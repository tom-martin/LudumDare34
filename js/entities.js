

var EntityFactory = {
	createCamera: function(threeCamera, offset, lookAtEntity) {
		var cameraEntity = new Entity();
		var cameraComponent = new CameraComponent();
		cameraComponent.threeCamera = threeCamera;
		cameraComponent.offset.copy(offset);
		cameraComponent.lookAtEntity = lookAtEntity;

		cameraEntity.cameraComponent = cameraComponent;

		cameraEntity.positionComponent = new PositionComponent();

		return cameraEntity;
	},

	createPlayer: function(scene) {
		var playerEntity = new Entity();
		playerEntity.positionComponent = new PositionComponent();

		playerEntity.threeJsComponent = new ThreeJsComponent();

		playerEntity.spriteComponent = new SpriteComponent();
		playerEntity.spriteComponent.sprite = new Sprite(4, 4, scene, Textures.plantHeadSheet, "idle", 1.0, null, -5);

		playerEntity.playerComponent = new PlayerComponent();

		playerEntity.carriesLightComponent = new CarriesLightComponent();
		var light = new THREE.PointLight( 0x60ff80, 1, 64 );
    	light.position.copy( playerEntity.positionComponent.position );
    	light.position.z += 1;
    	scene.add( light );
    	playerEntity.carriesLightComponent.light = light;

    	playerEntity.positionComponent.position.y = -13;

		return playerEntity;
	},

	createFly: function(scene) {
		var flyEntity = new Entity();
		flyEntity.positionComponent = new PositionComponent();

		flyEntity.threeJsComponent = new ThreeJsComponent();

		flyEntity.spriteComponent = new SpriteComponent();
		flyEntity.spriteComponent.sprite = new Sprite(4, 4, scene, Textures.flySheet, "flying", 1.0, null, -4);

		flyEntity.randomlyRotatesComponent = new RandomlyRotatesComponent();

		flyEntity.carriesLightComponent = new CarriesLightComponent();
		var light = new THREE.PointLight( 0xffffff, 1, 32 );
    	light.position.copy( flyEntity.positionComponent.position );
    	light.position.z += 1;
    	scene.add( light );
    	flyEntity.carriesLightComponent.light = light;

		return flyEntity;
	}
}