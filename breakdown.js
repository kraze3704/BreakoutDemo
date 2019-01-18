
// fetch the canvas by the id "myCanvas"
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

// attributes between beginPath() and closePath()
ctx.beginPath();
// paint a red square starting from (20, 40) of the canvas with 50px height & width
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

ctx.beginPath();
// center at (240, 160), radius of 20, start&end angle, direction(clockwise): optional
ctx.arc(240,160, 20, 0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(160, 10, 100, 40);
// only colors the outer stroke to semi-transparent blue with alpha channel in rgba function
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();