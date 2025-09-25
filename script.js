const breedList = document.getElementById("breedList");
const getImageBtn = document.getElementById("getImageBtn");
const imageContainer = document.getElementById("imageContainer");

// Load breeds into dropdown
async function loadBreeds() {
  const response = await fetch("https://dog.ceo/api/breeds/list/all");
  const data = await response.json();
  const breeds = Object.keys(data.message);
  breeds.forEach(breed => {
    let option = document.createElement("option");
    option.value = breed;
    option.innerText = breed.charAt(0).toUpperCase() + breed.slice(1);
    breedList.appendChild(option);
  });
}

// Get random image of selected breed
async function getBreedImage() {
  const breed = breedList.value;
  const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
  const data = await response.json();
  imageContainer.innerHTML = `<img src="${data.message}" alt="${breed}" width="300px" height="300px">`;

}

// Event listeners
getImageBtn.addEventListener("click", getBreedImage);

// Initial load
loadBreeds();