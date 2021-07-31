var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var gameOver, restart;

function preload() {
  trex_running = loadImage("unnamed.gif");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacleImg = loadImage("Covid-Virus.png")
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  backgroundImg = loadImage("download.jpeg");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addImage(trex_running)
  trex.scale = 0.1;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100);

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  text("Score: " + score, 500, 50);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + 3 * score / 100);
    if (keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if (mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.addImage(obstacleImg)
    //obstacle.debug = true;
    obstacle.setCollider("circle", 0,0,100)
    obstacle.velocityX = -(6 + 3 * score / 100);       
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}