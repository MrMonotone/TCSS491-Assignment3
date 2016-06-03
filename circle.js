function Circle(spec)
{
    this.radius = spec.radius || 20;
    this.visualRadius = spec.visualRadius || 500;
    this.color = spec.color;
    this.velocity = spec.velocity || {x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1000 + 3000), 
                     y: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1000 + 3000)}
    // this.velocity = { x: 5000, y: 5000};
    this.calculateVelocity();
    Entity.call(this, (this.radius + Math.random() * (gm.surfaceWidth - this.radius * 2)), 
                (this.radius + Math.random() * (gm.surfaceHeight - this.radius * 2)));
};

Circle.prototype = Object.create(Entity.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.randomVelocity = function (params) {
    
}

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > gm.surfaceWidth;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > gm.surfaceHeight;
};

Circle.prototype.checkSideCollision = function () 
{
    if (this.collideLeft() || this.collideRight()) 
    {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) 
            this.x = this.radius;
        if (this.collideRight()) 
            this.x = gm.surfaceWidth - this.radius;
        this.x += this.velocity.x * gm.clockTick;
        this.y += this.velocity.y * gm.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = gm.surfaceHeight - this.radius;
        this.x += this.velocity.x * gm.clockTick;
        this.y += this.velocity.y * gm.clockTick;
    }
}

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);

    this.x += this.velocity.x * gm.clockTick;
    this.y += this.velocity.y * gm.clockTick;
    
    this.checkSideCollision();

    gm.em.entities.forEach((ent) => 
    {
        if(ent !== this)
        {
            if (this.collide(ent))
            {
                var temp = { x: this.velocity.x, y: this.velocity.y };

                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x)/dist;
                var difY = (this.y - ent.y)/dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * gm.clockTick;
                this.y += this.velocity.y * gm.clockTick;
                ent.x += ent.velocity.x * gm.clockTick;
                ent.y += ent.velocity.y * gm.clockTick;
                
                if (this.radius > ent.radius)
                {
                    //find way to slow down
                    if (this.radius < maxRadius)
                    {
                        this.radius = this.radius + ent.radius / 3 < maxRadius ? this.radius + ent.radius / 3: maxRadius;
                        // this.radius += this.radius / 3;
                        this.velocity.x *= 0.5;
                        this.velocity.y *= 0.5;
                        this.checkSideCollision();
                        this.calculateVelocity();
                    }
                    ent.removeFromWorld = true;
                    // this.setNotIt();
                    // ent.setIt();
                }
                else if (this.radius < ent.radius)
                {
                    if(ent.radius < maxRadius)
                    {
                        ent.radius = ent.radius + this.radius / 3 < maxRadius ? ent.radius + this.radius / 3: maxRadius;
                        // ent.radius += this.radius / 3;
                        ent.velocity.x *= 0.5;
                        ent.velocity.y *= 0.5;
                        ent.checkSideCollision();
                        ent.calculateVelocity();
                    }
                    this.removeFromWorld = true;
                }
                else if (Math.random() > 0.5)
                {
                    if (this.color === ent.color)
                    {
                        if (this.radius < maxRadius)
                        {
                            // this.radius += this.radius / 3;
                            this.radius = this.radius + ent.radius / 3 < maxRadius ? this.radius + ent.radius / 3: maxRadius;
                            this.velocity.x *= 0.5;
                            this.velocity.y *= 0.5;
                            this.checkSideCollision();
                            this.calculateVelocity();
                        }
                        ent.removeFromWorld = true;
                    }
                    else if (Math.random() > 0.5)
                    {
                        if(maxEntity > gm.em.entities.length)
                        {
                            this.removeFromWorld = true;
                            ent.removeFromWorld = true;
                            var radius = this.radius / 2;
                            if (this.radius === maxRadius)
                            {
                                radius = this.radius / 4;
                            }
                            for(var i = 0; i < 5; i++)
                            {
                                radius = radius > minRadius ? radius : minRadius;
                                
                                gm.em.addEntity(new Circle({color: this.color, radius: radius}))
                                gm.em.addEntity(new Circle({color: ent.color, radius: radius}))
                            }
                        }
                        // gm.em.update();
                    }
                }                  
            }
        
            if (this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) 
            {
                var dist = distance(this, ent);
                
                // Chase?
                if (ent.radius < this.radius && dist > this.radius + ent.radius + 10) {
                    var difX = (ent.x - this.x) / dist;
                    var difY = (ent.y - this.y) / dist;
                    this.velocity.x += difX * acceleration / (dist * dist);
                    this.velocity.y += difY * acceleration / (dist * dist);
                    this.calculateVelocity();
                }
                
                // Run away
                if (ent.radius > this.radius && dist > this.radius + ent.radius) {
                    var difX = (ent.x - this.x) / dist;
                    var difY = (ent.y - this.y) / dist;
                    this.velocity.x -= difX * acceleration / (dist * dist);
                    this.velocity.y -= difY * acceleration / (dist * dist);
                    this.calculateVelocity();
                }
            }
        }
    })
    
    this.velocity.x -= (1 - friction) * gm.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * gm.clockTick * this.velocity.y;
};

Circle.prototype.calculateVelocity = function () {
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed)
    {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};
