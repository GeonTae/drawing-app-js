const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const eraserBtn = document.getElementById("eraser-btn");
const destroyBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
); //color div box
//document.getElementsByClassName("color-option") type is HTML element collection => convert it to array
const color = document.getElementById("color"); //color input box
const lineWidth = document.getElementById("line-width");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); // ctx = context for pain brush

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth.value; //initializing.
ctx.lineCap = "round"; //to make the line end round

let isPainting = false; // To check if drawing is enabled
let isFilling = false;

function onMouseMove(event) {
  if (isPainting) {
    // If true drawing, if not do nothing
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    // return;
  }
  ctx.moveTo(event.offsetX, event.offsetY); // Set start point
}

function startPainting(event) {
  isPainting = true;
}

function stopPainting(event) {
  isPainting = false;
  ctx.beginPath(); //to reset the path
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  //   console.dir(event.target.dataset.color);
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = event.target.dataset.color;
  ctx.fillStyle = event.target.dataset.color;
  color.value = colorValue; // to change the color input box
}

function onModeClick(event) {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "✍🏻 Drawing mode";
  } else {
    isFilling = true;
    modeBtn.innerText = "🩸 Filling mode";
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  //   alert("Are you sure you want to destroy it?");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false; //when you click eraser button -> change the fill to draw mode too
  modeBtn.innerText = "✍🏻 Drawing mode";
}

function onFileChange(event) {
  console.dir(event.target); //check files part.
  //javascript can't load the image directly. Image is saved in the browser, so we use the url that browser offer
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  //   console.log(url);
  const image = new Image(); // === <img src=""/>
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); //position where to put, size
  };
  fileInput.value = null;
}

// function onDoubleClick(event) {
//   // console.log(event.offsetX, event.offsetY);
//   const text = textInput.value;
//   if (text === "") {
//     return;
//   }
//   ctx.save();

//   ctx.lineWidth = 1;
//   ctx.font = "48px serif";
//   ctx.fillText(text, event.offsetX, event.offsetY);
//   // ctx.strokeText
//   ctx.restore();
// }

function onDoubleClick(event) {
  // console.log(event.offsetX, event.offsetY);
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = "48px serif";
    ctx.strokeText(text, event.offsetX, event.offsetY); //paint it to this location
    // ctx.fillText
    ctx.restore(); //open the download window
  }
}

function onSaveClick() {
  // console.log(canvas.toDataURL()); // encoded as base64
  const url = canvas.toDataURL();
  const a = document.createElement("a"); //anchor
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
  // <a href="" download></a> //download triger download
}

//canvas.onmousemove = onMove
canvas.addEventListener("dblclick", onDoubleClick); //event for text input
canvas.addEventListener("mousemove", onMouseMove); // Start drawing
canvas.addEventListener("mousedown", startPainting); // Draw as mouse moves
canvas.addEventListener("mouseup", stopPainting); // Stop drawing when mouse is released
canvas.addEventListener("mouseleave", stopPainting); // Stop drawing if the mouse leaves the canvas
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
