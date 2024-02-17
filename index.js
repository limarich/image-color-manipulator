const canvas = document.getElementById("canvas");
const imageInput = document.getElementById("image-input");
const ctx = canvas.getContext("2d");

const redController = document.getElementById("red");
const greenController = document.getElementById("green");
const blueController = document.getElementById("blue");
const alphaController = document.getElementById("alpha");
const negativeController = document.getElementById("negative");
const thresholdController = document.getElementById("threshold");
const grayScaleController = document.getElementById("greyScale");

canvas.width = 800;
canvas.height = 450;

const image = new Image();
image.src = "./assets/image-1.jpg";

image.addEventListener("load", () => {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
});

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataURL = e.target.result;

      image.src = dataURL;
    };

    reader.readAsDataURL(file);
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
});

redController.addEventListener("input", updateImage);
greenController.addEventListener("input", updateImage);
blueController.addEventListener("input", updateImage);
alphaController.addEventListener("input", updateImage);
negativeController.addEventListener("input", (e) => negative(e.target.value));
thresholdController.addEventListener("input", (e) => threshold(e.target.value));
grayScaleController.addEventListener("input", (e) => greyScale(e.target.value));

function downloadImage() {
  const a = document.createElement("a");
  a.href = canvas.toDataURL();
  a.download = "imagem.jpg";
  a.click();
}
function resetImage() {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

function updateImage() {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const red = redController.value;
  const green = greenController.value;
  const blue = blueController.value;
  const alpha = alphaController.value;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * red;
    data[i + 1] = data[i + 1] * green;
    data[i + 2] = data[i + 2] * blue;
    data[i + 3] = data[i + 3] * alpha;
  }
  imageData.data = data;

  ctx.putImageData(imageData, 0, 0);
}

const threshold = (coefficient) => {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const color = average > coefficient ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = color;
  }

  imageData.data = data;
  ctx.putImageData(imageData, 0, 0);
};

const greyScale = (coefficient = 1) => {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = average * coefficient;
  }

  imageData.data = data;
  ctx.putImageData(imageData, 0, 0);
};

const negative = (coefficient = 1) => {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 * coefficient - data[i];
    data[i + 1] = 255 * coefficient - data[i + 1];
    data[i + 2] = 255 * coefficient - data[i + 2];
  }

  imageData.data = data;
  ctx.putImageData(imageData, 0, 0);
};
