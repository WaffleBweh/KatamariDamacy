/**
 * A sample game.js for you to work from
 */

TheGame = pc.Game.extend('TheGame',
        {},
        {
            gameScene: null,
            menuScene: null,
            loadingScene: null,
            loadingLayer: null,
            onReady: function()
            {
                this._super();
                // Load the all ressources
                pc.device.loader.add(new pc.Image('ball', 'images/ball.png'));
                pc.device.loader.add(new pc.Image('katamari', 'images/katamari.png'));
                pc.device.loader.add(new pc.Image('duck', 'images/bubberducky_spritesheet.png'));
                pc.device.loader.add(new pc.Image('background', 'images/background.png'));
                pc.device.loader.add(new pc.Image('menu_background', 'images/menu_background_dimmed.png'));
                pc.device.loader.add(new pc.Sound('bgmusic', 'sounds/bgmusic', ['mp3'], 1));

                this.loadingScene = new pc.Scene();
                this.loadingLayer = new pc.Layer('loading');
                this.loadingScene.addLayer(this.loadingLayer);
                // fire up the loader
                pc.device.loader.start(this.onLoading.bind(this), this.onLoaded.bind(this));
            },
            onLoading: function(percentageComplete)
            {
                var ctx = pc.device.ctx;
                ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);
                ctx.font = "normal 50px Verdana";
                ctx.fillStyle = "#88f";
                ctx.fillText('Katamari Damacy 2D !', 40, (pc.device.canvasHeight / 2) - 50);
                ctx.font = "normal 18px Verdana";
                ctx.fillStyle = "#777";
                ctx.fillText('Loading: ' + percentageComplete + '%', 40, pc.device.canvasHeight / 2);
            },
            onLoaded: function()
            {
                // create the game scene (notice we do it here AFTER the resources are loaded)
                this.gameScene = new GameScene();
                this.addScene(this.gameScene);

                // create the menu scene (but don't make it active)
                this.menuScene = new MenuScene();
                this.addScene(this.menuScene, false);

                // resources are all ready, start the main game scene
                // (or a menu if you have one of those)
                this.activateScene(this.menuScene);
            },
            activateMenu: function()
            {
                this.deactivateScene(this.gameScene);
                this.activateScene(this.menuScene);
            },
            deactivateMenu: function()
            {
                this.deactivateScene(this.menuScene);
                this.activateScene(this.gameScene);
            }
        });


