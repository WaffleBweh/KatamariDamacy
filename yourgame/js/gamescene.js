GameScene = pc.Scene.extend('GameScene',
        {},
        {
            entityFactory: null,
            gameLayer: null,
            backgroundLayer: null,
            music: null,
            player: null,
            ball: null,
            duck: null,
            playerPhysics: null,
            ballPhysics: null,
            duckPhysics: null,
//            sheepSheet1 : null,
//            sheepSheet2 : null,
//            humanSheet1 : null,
//            humanSheet2 : null,
            init: function()
            {
                this._super();
                this.entityFactory = new EntityFactory();
                this.music = pc.device.loader.get('bgmusic').resource;
                this.music.setVolume(0.2);
                this.music.play(true);
                //On déclare les Layers
                this.backgroundLayer = this.addLayer(new pc.EntityLayer('background layer', 10000, 10000));
                this.gameLayer = this.addLayer(new pc.EntityLayer('game layer', 10000, 10000));
                // On lance les systèmes
                this.gameLayer.addSystem(new pc.systems.Render());
                this.gameLayer.addSystem(new pc.systems.Effects());
                this.gameLayer.addSystem(new pc.systems.Physics());
                this.gameLayer.addSystem(new BrainSystem());
                this.backgroundLayer.addSystem(new pc.systems.Render());
                //On dessine l'herbe sur tout le terrin
                for (var i = 0; i < (pc.device.canvasHeight / 258) + 1; i++)
                {
                    for (var j = 0; j < (pc.device.canvasWidth / 358) + 1; j++) {
                        var bg = pc.Entity.create(this.backgroundLayer);
                        bg.addComponent(pc.components.Sprite.create({spriteSheet: new pc.SpriteSheet({image: pc.device.loader.get('background').resource})}));
                        bg.addComponent(pc.components.Spatial.create({dir: 0, x: j * 358, y: i * 258, w: 358, h: 258}));
                    }
                    ;
                }
                //On dessine les murs (dependent de la taille de l'écran)
                this.entityFactory.createEntity('wallY', this.gameLayer, 0, 0); // gauche
                this.entityFactory.createEntity('wallX', this.gameLayer, 0, 0); // haut
                this.entityFactory.createEntity('wallY', this.gameLayer, pc.device.canvasWidth, 0); // droite
                this.entityFactory.createEntity('wallX', this.gameLayer, 0, pc.device.canvasHeight); // bas

                //On dessine le joueur au milleur de l'écran
                this.player = this.entityFactory.createEntity('player', this.gameLayer, pc.device.canvasWidth / 2, pc.device.canvasHeight / 2, 0);
                this.playerPhysics = this.player.getComponent('physics');
                //On ajoute la balle
                this.ball = this.entityFactory.createEntity('ball', this.gameLayer, pc.device.canvasWidth / 2, pc.device.canvasHeight / 2, 0);
                this.ballPhysics = this.ball.getComponent('physics');
                //On ajoute des monstres
                this.duck = this.entityFactory.createEntity('duck', this.gameLayer, 0, 0, 0);

                //On ajoute un joint
                this.ballJoint = pc.components.Joint.create({
                    attachedTo: this.player,
                    type: pc.JointType.REVOLUTE,
                    offset: {x: -48, y: 0}, // where on the barrel the joint is
                    attachmentOffset: {x: 0, y: 0}, // where on the cannon base the joint is
                    maxMotorTorque: 200,
                    motorSpeed: 0,
                    enableMotor: true
                });
                this.ball.addComponent(this.ballJoint);
                //WASD pour mouvements
                pc.device.input.bindState(this, 'moveUp', 'W');
                pc.device.input.bindState(this, 'moveDown', 'S');
                pc.device.input.bindState(this, 'moveLeft', 'A');
                pc.device.input.bindState(this, 'moveRight', 'D');
                //Fleches du clavier pour mouvements
                pc.device.input.bindState(this, 'moveUp', 'UP');
                pc.device.input.bindState(this, 'moveDown', 'DOWN');
                pc.device.input.bindState(this, 'moveLeft', 'LEFT');
                pc.device.input.bindState(this, 'moveRight', 'RIGHT');
                //Retrouner au menu principal avec Escape
                pc.device.input.bindAction(this, 'menu', 'ESC');
            },
            // handle menu actions
            onAction: function(actionName, event, pos, uiTarget)
            {
                if (pc.device.game.menuScene.active)
                    return true;
                if (actionName === 'menu')
                    pc.device.game.activateMenu();
                return false; // eat the event (so it wont pass through to the newly activated menuscene
            },
            process: function()
            {
                // clear the background
                pc.device.ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);
                // always call the super
                this._super();
                //On s'occupe des controls
                if (pc.device.input.isInputState(this, 'moveLeft')) {
                    this.playerPhysics.applyTurn(-50);
                }
                if (pc.device.input.isInputState(this, 'moveRight')) {
                    this.playerPhysics.applyTurn(50);
                }
                if (!(pc.device.input.isInputState(this, 'moveLeft')) && !(pc.device.input.isInputState(this, 'moveRight'))) {
                    this.playerPhysics.applyTurn(0);
                }
                if (pc.device.input.isInputState(this, 'moveUp')) {
                    this.playerPhysics.applyForce(-40);
                    this.ballJoint.setMotorSpeed(-2);
                }
                else {
                    this.ballJoint.setMotorSpeed(0);
                }
                if (pc.device.input.isInputState(this, 'moveDown')) {
                    this.playerPhysics.applyForce(20);
                    this.ballJoint.setMotorSpeed(2);
                }
                if ((Math.random() * 1000) + 1 > 995) {
                    this.duck = this.entityFactory.createEntity('duck', this.gameLayer, 0, pc.device.canvasHeight / 2, 0);
                } else if ((Math.random() * 1000) + 1 > 995) {
                    this.duck = this.entityFactory.createEntity('duck', this.gameLayer, pc.device.canvasWidth - 256, pc.device.canvasHeight / 2, 0);
                }
            },
            onCollisionStart: function(aType, bType, entityA, entityB, fixtureAType,
                    fixtureBType, contact)
            {
                if (entityA.hasTag('DUCK') && entityB.hasTag('BALL')) {
                    this.monsterJoint = pc.components.Joint.create({
                        attachedTo: this.ball,
                        type: pc.JointType.REVOLUTE,
                        offset: {x: -48, y: 0}, // where on the barrel the joint is
                        attachmentOffset: {x: 0, y: 0}, // where on the cannon base the joint is
                    });
                    this.ball.addComponent(this.monsterJoint);
                }
            }
        });