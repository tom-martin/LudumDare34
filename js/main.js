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
hudBuffer.width  = 256;
hudBuffer.height = 224;

var hudBufferContext = hudBuffer.getContext('2d');

renderer.domElement.add

var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

container.appendChild( stats.domElement );

// var light1 = new THREE.DirectionalLight(0xffffff, 1);
// light1.position.set(1,0.5,1).normalize();
// scene.add(light1);

scene.add(new THREE.AmbientLight( 0x202020 ));

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
var playerSystem = new PlayerSystem(input, scene);
var randomlyRotatesSystem = new RandomlyRotatesSystem();
var movesByRotationSystem = new MovesByRotationSystem();
var getsEatenSystem = new GetsEatenSystem();
var recyclesNearPlayerSystem = new RecyclesNearPlayerSystem();
var lightCarryingSystem = new LightCarryingSystem();

var spriteSystem = new SpriteSystem();
var playerEntity = EntityFactory.createPlayer(scene);
spriteSystem.spriteEntities.push(playerEntity);
playerSystem.playerEntity = playerEntity;
getsEatenSystem.eatingEntities.push(playerEntity);
recyclesNearPlayerSystem.playerEntity = playerEntity;


var cameraSystem = new CameraSystem();
var cameraEntity = EntityFactory.createCamera(threeCamera, new THREE.Vector3(0.1, 0.1, 32), playerEntity);
cameraSystem.cameraEntity = cameraEntity;


var wallTileGeometry = new THREE.PlaneBufferGeometry( 16, 16, 16, 16);
var brickTexture = THREE.ImageUtils.loadTexture("textures/brick.png");
brickTexture.magFilter = THREE.NearestFilter;
brickTexture.minFilter = THREE.NearestFilter;
brickTexture.generateMipMaps = false;    
var brickMaterial = new THREE.MeshLambertMaterial( { 
    map: brickTexture,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 3,
    polygonOffset: true
} );
for(var x = -40; x < 40; x++) {
    for(var y = 0; y < 80; y++) {
        var plane = new THREE.Mesh( wallTileGeometry, brickMaterial );
        plane.position.x = x * 16;
        plane.position.y = y * 16;
        scene.add( plane );
    }
}

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

window.addEventListener("resize", respondToResize);

function render() {
    stats.begin();
    var now = Date.now();
    var tick = Math.min(0.1, (now - lastFrameTime) / 1000);
    lastFrameTime = now;
    requestAnimationFrame(render);

    playerSystem.update(now, tick);
    threeJsSystem.update(now, tick);
    spriteSystem.update(now, tick);
    cameraSystem.update(now, tick);
    randomlyRotatesSystem.update(now, tick);
    movesByRotationSystem.update(now, tick);
    getsEatenSystem.update(now, tick);
    recyclesNearPlayerSystem.update(now, tick);
    lightCarryingSystem.update(now, tick);

    renderer.render(scene, threeCamera);
    
    hudContext.imageSmoothingEnabled = false;
    hudContext.clearRect(0, 0, hud.width, hud.height);
    hudBufferContext.imageSmoothingEnabled = false;
    hudBufferContext.clearRect(0, 0, hudBuffer.width, hudBuffer.height);

    var widthRatio = hud.width / hudBuffer.width;
    var heightRatio = hud.height / hudBuffer.height;
    var ratio = Math.min(widthRatio, heightRatio);
    var destWidth = Math.floor(hudBuffer.width * ratio)
    var destHeight = Math.floor(hudBuffer.height * ratio)

    var destX = Math.floor((hud.width - destWidth) / 2);
    var destY = Math.floor((hud.height - destHeight) / 2);

    hudContext.drawImage(hudBuffer, 0, 0, hudBuffer.width, hudBuffer.height, destX, destY, destWidth, destHeight);


    stats.end();
}
render();
