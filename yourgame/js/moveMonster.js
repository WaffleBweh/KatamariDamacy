BrainSystem = pc.systems.EntitySystem.extend('BrainSystem',
        {},
        {
            init: function()
            {
                this._super(this.Class.shortName);
            },
            process: function(entity)
            {
                var entityPhysics = entity.getComponent('physics');
                console.log('blablab');
                if (entity.hasTag('DUCK')) {

                    entityPhysics.applyForce(2);
                    console.log('blablab');
                }
            }
        }
);