// Utility Functions

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

//MDN exculsive max
function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}


function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c.toString());
}

// Globals
var gm = gm || {};
var maxRadius = 150;
var minRadius = 3;
const NUM_OF_CIRCLES = 20;
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;
var maxEntity = 150;

var socket = io.connect("http://76.28.150.193:8888");

socket.on("load", function (data) {
        let newData = [];
        data.data.forEach(function(element) {
            let circle = new Circle({radius: element.radius, velocity: element.velocity, 
                                     visualRadius: element.visualRadius, color: element.color});
            circle.x = element.x;
            circle.y = element.y;
            circle.removeFromWorld = element.removeFromWorld;
            newData.push(circle);
        }, this);
        gm.em.entities = newData;
});

window.addEventListener('load', () => {
	var canvas = document.getElementById("gameWorld");
	canvas.focus();
	var ctx = canvas.getContext("2d");
	
	gm = new GameManager(ctx);
	gm.start();

});