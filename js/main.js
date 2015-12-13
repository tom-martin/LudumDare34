var scene = new THREE.Scene();
var threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.style.zIndex = 1;
var container = document.getElementById('container');

var hud = document.createElement('canvas');
hud.width  = window.innerWidth;
hud.height = window.innerHeight;
hud.style.position = "absolute";
hud.style.zIndex   = 2;

container.appendChild(hud);
container.appendChild(renderer.domElement);

var hudContext = hud.getContext('2d');

var hudBuffer = document.createElement('canvas');
hudBuffer.width  = 128;
hudBuffer.height = 112;

var hudBufferContext = hudBuffer.getContext('2d');

renderer.domElement.add

// var stats = new Stats();
// stats.setMode(0); // 0: fps, 1: ms

// // align top-left
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.left = '0px';
// stats.domElement.style.top = '0px';

// container.appendChild( stats.domElement );

// var light1 = new THREE.DirectionalLight(0xffffff, 1);
// light1.position.set(1,0.5,1).normalize();
// scene.add(light1);

scene.add(new THREE.AmbientLight( 0x101020 ));

var lastFrameTime = Date.now();

var respondToResize = function() {
    threeCamera.aspect = window.innerWidth / window.innerHeight;
    threeCamera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    hud.width  = window.innerWidth;
    hud.height = window.innerHeight;
}

respondToResize();

var input = new Input();
var threeJsSystem = new ThreeJsSystem();
var hazardSystem = new HazardSystem();
var playerSystem = new PlayerSystem(input, scene, hazardSystem);
var randomlyRotatesSystem = new RandomlyRotatesSystem();
var movesByRotationSystem = new MovesByRotationSystem();
var particleSystem = new ParticleSystem();
var getsEatenSystem = new GetsEatenSystem(particleSystem);
var recyclesNearPlayerSystem = new RecyclesNearPlayerSystem();
var lightCarryingSystem = new LightCarryingSystem();

var spriteSystem = new SpriteSystem();
var playerEntity = EntityFactory.createPlayer(scene);
spriteSystem.spriteEntities.push(playerEntity);
playerSystem.playerEntity = playerEntity;
getsEatenSystem.eatingEntities.push(playerEntity);
recyclesNearPlayerSystem.playerEntity = playerEntity;
lightCarryingSystem.lightCarryingEntities.push(playerEntity);
hazardSystem.playerEntity = playerEntity;


var cameraSystem = new CameraSystem();
var cameraEntity = EntityFactory.createCamera(threeCamera, new THREE.Vector3(0.1, 0.1, 32), playerEntity);
cameraSystem.cameraEntity = cameraEntity;


var wallTileGeometry = new THREE.PlaneBufferGeometry( 32, 32, 12, 12);
var brickTexture = THREE.ImageUtils.loadTexture("textures/brick.png");
brickTexture.magFilter = THREE.NearestFilter;
brickTexture.minFilter = THREE.NearestFilter;
brickTexture.generateMipMaps = false;    
var brickMaterial = new THREE.MeshLambertMaterial( { 
    map: brickTexture,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 4,
    polygonOffset: true
} );

var brickTexture2 = THREE.ImageUtils.loadTexture("textures/brick2.png");
brickTexture2.magFilter = THREE.NearestFilter;
brickTexture2.minFilter = THREE.NearestFilter;
brickTexture2.generateMipMaps = false;    
var brickMaterial2 = new THREE.MeshLambertMaterial( { 
    map: brickTexture2,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 4,
    polygonOffset: true
} );


var drainPipeTexture = THREE.ImageUtils.loadTexture("textures/drainPipeVert1.png");
drainPipeTexture.magFilter = THREE.NearestFilter;
drainPipeTexture.minFilter = THREE.NearestFilter;
drainPipeTexture.generateMipMaps = false;    
var drainPipeMaterial = new THREE.MeshBasicMaterial( { 
    map: drainPipeTexture,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 3,
    polygonOffset: true,
    transparent: true
} );

var drainPipeHorizTexture = THREE.ImageUtils.loadTexture("textures/drainPipeHoriz1.png");
drainPipeHorizTexture.magFilter = THREE.NearestFilter;
drainPipeHorizTexture.minFilter = THREE.NearestFilter;
drainPipeHorizTexture.generateMipMaps = false;    
var drainPipeHorizMaterial = new THREE.MeshBasicMaterial( { 
    map: drainPipeHorizTexture,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 2,
    polygonOffset: true,
    transparent: true
} );

function addVerticalDrainPipe(x, y, height) {
    var drainPipeGeometry = new THREE.PlaneBufferGeometry( 4, height, 1, Math.floor(height/4));
    var plane = new THREE.Mesh( drainPipeGeometry, drainPipeMaterial );
    plane.position.x = x * 32;
    plane.position.y = y * 32;
    hazardSystem.staticHazards.push({x: plane.position.x, y: plane.position.y, halfWidth: 2, halfHeight: height/2});
    scene.add( plane );
}

function addHorizontalDrainPipe(x, y, width) {
    var drainPipeGeometry = new THREE.PlaneBufferGeometry( width, 4, Math.floor(width/4), 1);
    var plane = new THREE.Mesh( drainPipeGeometry, drainPipeHorizMaterial );
    plane.position.x = x * 32;
    plane.position.y = y * 32;
    hazardSystem.staticHazards.push({x: plane.position.x, y: plane.position.y, halfWidth: width/2, halfHeight: 2});
    scene.add( plane );
}

for(var x = -20; x < 20; x++) {
    for(var y = 0; y < 40; y++) {
        var bm = brickMaterial;
        if(Math.random() < 0.2) {
            bm = brickMaterial2;
        }
        var plane = new THREE.Mesh( wallTileGeometry, bm );
        plane.position.x = x * 32;
        plane.position.y = y * 32;
        scene.add( plane );

        if(Math.random() < 0.1 && plane.position.x != 0) {
            var height = (5+Math.floor(Math.random()*10))*4;
            addVerticalDrainPipe(x, y, height);
        }

        if(Math.random() < 0.1 && plane.position.x != 0) {
            var width = (5+Math.floor(Math.random()*10))*4;
            addHorizontalDrainPipe(x, y, width);
        }
    }
}

addVerticalDrainPipe(-20.5, 19.5, 40*32);
addVerticalDrainPipe(19.5, 19.5, 40*32);
addHorizontalDrainPipe(-0.5, -0.5, 40*32);
addHorizontalDrainPipe(-0.5, 39.5, 40*32);

for(var i = 0; i < 50; i++) {
    var flyEntity = EntityFactory.createFly(scene);
    spriteSystem.spriteEntities.push(flyEntity);
    flyEntity.positionComponent.position.set(((Math.random()*8)-4) * 16, ((Math.random()*8))*16, 0);
    randomlyRotatesSystem.randomlyRotateEntities.push(flyEntity);
    movesByRotationSystem.movedByRotationEntities.push(flyEntity);
    getsEatenSystem.edibleEntities.push(flyEntity);
    recyclesNearPlayerSystem.recyclableEntities.push(flyEntity);
    lightCarryingSystem.lightCarryingEntities.push(flyEntity);
}

for(var i = 0; i < 200; i++) {
    var particleEntity = EntityFactory.createParticleEntity(scene);
    threeJsSystem.threeJsEntities.push(particleEntity);
    particleEntity.positionComponent.position.set(((Math.random()*8)-4) * 16, ((Math.random()*8))*16, 0);
    particleSystem.particleEntities.push(particleEntity);
}



window.addEventListener("resize", respondToResize);

var scoreImage = new Image();
scoreImage.src = "textures/scoreFont.png";

var splashImage = new Image();
splashImage.src = "textures/splash.png";

var endSplashImage = new Image();
endSplashImage.src = "textures/endSplash.png";

var previousScore = 0
var jiggleTime = 0;

var scoreString = ""


var splashVisible = true;

function render() {
    // stats.begin();
    var now = Date.now();
    var tick = Math.min(0.1, (now - lastFrameTime) / 1000);
    lastFrameTime = now;
    requestAnimationFrame(render);

    if(splashVisible && input.spaceDown) {
        playerEntity.playerComponent.running = true;
        splashVisible = false;
        input.spaceDown = false;
    }

    if(playerEntity.playerComponent.dead && input.spaceDown) {
        location.reload();
    }

    playerSystem.update(now, tick);
    threeJsSystem.update(now, tick);
    spriteSystem.update(now, tick);
    cameraSystem.update(now, tick);
    randomlyRotatesSystem.update(now, tick);
    movesByRotationSystem.update(now, tick);
    getsEatenSystem.update(now, tick);
    recyclesNearPlayerSystem.update(now, tick);
    lightCarryingSystem.update(now, tick);
    hazardSystem.update(now, tick);
    particleSystem.update(now, tick);
    

    renderer.render(scene, threeCamera);
    
    hudContext.imageSmoothingEnabled = false;
    hudContext.clearRect(0, 0, hud.width, hud.height);
    hudBufferContext.imageSmoothingEnabled = false;

    hudBufferContext.clearRect(0, 0, hudBuffer.width, hudBuffer.height);

    if(previousScore != playerEntity.playerComponent.fliesEaten) {
        previousScore = playerEntity.playerComponent.fliesEaten;
        scoreString = ""+playerEntity.playerComponent.fliesEaten;
        jiggleTime = now;
    }

    if(splashVisible) {
        hudBufferContext.drawImage(splashImage, 0, 0);
    }

    var fontX = 1;
    var fontY = 1;
    if(playerEntity.playerComponent.dead) {
        hudBufferContext.drawImage(endSplashImage, 0, 0);
        fontX += 75;
        fontY += 68;
        jiggleTime = 0;
    }

    if((now - jiggleTime) < 600) {
        fontY += Math.round((now-jiggleTime)/200)%2;
    }

    for(var i in scoreString) {
        var scoreDigit = scoreString[i];
        hudBufferContext.drawImage(scoreImage, scoreDigit*5, 0, 5, 8, fontX, fontY, 5, 8);
        fontX+=4;
    }

    var widthRatio = hud.width / hudBuffer.width;
    var heightRatio = hud.height / hudBuffer.height;
    var ratio = Math.min(widthRatio, heightRatio);
    var destWidth = Math.floor(hudBuffer.width * ratio)
    var destHeight = Math.floor(hudBuffer.height * ratio)

    var destX = Math.floor((hud.width - destWidth) / 2);
    var destY = Math.floor((hud.height - destHeight) / 2);

    hudContext.drawImage(hudBuffer, 0, 0, hudBuffer.width, hudBuffer.height, destX, destY, destWidth, destHeight);

    // stats.end();
}
render();
