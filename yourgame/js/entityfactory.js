//On déclare les types de colisions
CollisionType =
        {
            NONE: 0x0000, // BIT MAP
            ENEMY: 0x0001, // 0000001
            FRIENDLY: 0x0002 // 0000010
        };
EntityFactory = pc.EntityFactory.extend('EntityFactory',
        {}, {
    //VARIABLES
    playerSheet: null,
    ballSheet: null,
    ballJoint: null,
    duckSheet: null,
    init: function()
    {
        //On ajoute des sheets et des animations
        this.playerSheet = new pc.SpriteSheet({image: pc.device.loader.get('katamari').resource, frameWidth: 64, frameHeight: 64, useRotation: true});
        this.playerSheet.addAnimation({name: 'floating', frameCount: 1});
        this.ballSheet = new pc.SpriteSheet({image: pc.device.loader.get('ball').resource, frameWidth: 64, frameHeight: 64, useRotation: true});
        this.ballSheet.addAnimation({name: 'floating', frameCount: 1});
        this.duckSheet = new pc.SpriteSheet({image: pc.device.loader.get('duck').resource, frameWidth: 64, frameHeight: 64, useRotation: true});
        this.duckSheet.addAnimation({name: 'walk', frameX: 0, frameY: 0, frameCount: 2, time: 500});
    },
    createEntity: function(type, layer, x, y, dir, attachTo)
    {
        //La fonction create entity permet de créer des entités et de les afficher a l'écran
        var e = null;
        switch (type)
        {
            //On crée un joueur
            case 'player':
                e = pc.Entity.create(layer);
                e.addTag('PLAYER');
                e.addComponent(pc.components.Sprite.create({spriteSheet: this.playerSheet}), {animationStart: 'floating'});
                e.addComponent(pc.components.Spatial.create({x: x, y: y, dir: dir, w: this.playerSheet.frameWidth, h: this.playerSheet.frameHeight}));
                e.addComponent(pc.components.Physics.create(
                        {
                            maxSpeed: {x: 70, y: 70},
                            linearDamping: 0.25,
                            mass: 20,
                            shapes: [
                                {
                                    shape: pc.CollisionShape.CIRCLE
                                }
                            ],
                            collisionGroup: -1,
                            collisionCategory: CollisionType.FRIENDLY,
                            collisionMask: CollisionType.ENEMY
                        }));
                return e;
            //On crée les murs en X
            case 'wallX' :
                var e = pc.Entity.create(layer);
                e.addTag('WALL');
                e.addComponent(pc.components.Spatial.create({x: x, y: y, dir: 0, w: pc.device.canvasWidth, h: 2}));
                e.addComponent(pc.components.Physics.create({immovable: true,
                    collisionCategory: CollisionType.ENEMY, collisionMask: CollisionType.FRIENDLY | CollisionType.ENEMY, collisionGroup: -2,
                    shapes: [
                        {shape: pc.CollisionShape.RECT}
                    ]
                }));
                return e;
            //On crée les murs en Y
            case 'wallY' :
                var e = pc.Entity.create(layer);
                e.addTag('WALL');
                e.addComponent(pc.components.Spatial.create({x: x, y: y, dir: 0, w: 2, h: pc.device.canvasHeight}));
                e.addComponent(pc.components.Physics.create({immovable: true,
                    collisionCategory: CollisionType.ENEMY, collisionMask: CollisionType.FRIENDLY | CollisionType.ENEMY, collisionGroup: -2,
                    shapes: [
                        {shape: pc.CollisionShape.RECT}
                    ]
                }));
                return e;
            //On crée une balle
            case 'ball':
                e = pc.Entity.create(layer);
                e.addTag('BALL');
                e.addComponent(pc.components.Sprite.create({spriteSheet: this.ballSheet}), {animationStart: 'floating'});
                e.addComponent(pc.components.Spatial.create({x: x, y: y, dir: dir, w: this.ballSheet.frameWidth, h: this.ballSheet.frameHeight}));
                e.addComponent(pc.components.Physics.create(
                        {
                            maxSpeed: {x: 0, y: 0},
                            linearDamping: 0.25,
                            mass: 0,
                            shapes: [
                                {
                                    shape: pc.CollisionShape.CIRCLE
                                }
                            ],
                            collisionGroup: -1,
                            collisionCategory: CollisionType.FRIENDLY,
                            collisionMask: CollisionType.ENEMY
                        }));
                return e;
            //On crée un canard
            case 'duck':
                e = pc.Entity.create(layer);
                e.addTag('DUCK');
                e.addComponent(pc.components.Sprite.create({spriteSheet: this.duckSheet}), {animationStart: 'walk'});
                e.addComponent(pc.components.Spatial.create({x: x, y: y, dir: dir, w: this.duckSheet.frameWidth, h: this.duckSheet.frameHeight}));
                e.addComponent(pc.components.Physics.create(
                        {
                            maxSpeed: {x: 0, y: 0},
                            linearDamping: 0.25,
                            mass: 1,
                            shapes: [
                                {
                                    shape: pc.CollisionShape.RECT
                                }
                            ],
                            collisionGroup: -3,
                            collisionCategory: CollisionType.ENEMY,
                            collisionMask: CollisionType.FRIENDLY
                        }));
                return e;
        }
        return null;
    }
});