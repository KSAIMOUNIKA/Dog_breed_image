const breedList = document.getElementById("breedList");
const getImageBtn = document.getElementById("getImageBtn");
const imageContainer = document.getElementById("imageContainer");
const moreImagesSection = document.getElementById("moreImagesSection");
const loadingIndicator = document.getElementById("loadingIndicator");
const splashScreen = document.getElementById("splashScreen");
const mainApp = document.getElementById("mainApp");


function formatBreedName(breedName) {
    if (breedName.includes('-')) {
        const parts = breedName.split('-');
        return parts.reverse().map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    return breedName.charAt(0).toUpperCase() + breedName.slice(1);
}

function setLoading(show) {
    loadingIndicator.classList.toggle('hidden', !show);
}

async function loadBreeds() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();

        if (data.status !== 'success') {
            console.error("API error fetching breeds:", data.message);
            return;
        }

        const breeds = data.message;
        
        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.innerText = "Select a Dog Breed";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        breedList.appendChild(defaultOption);

        for (const mainBreed in breeds) {
            const subBreeds = breeds[mainBreed];

            if (subBreeds.length === 0) {
                let option = document.createElement("option");
                option.value = mainBreed;
                option.innerText = formatBreedName(mainBreed);
                breedList.appendChild(option);
            } else {
                let mainOption = document.createElement("option");
                mainOption.value = mainBreed;
                mainOption.innerText = formatBreedName(mainBreed) + " (Any)";
                breedList.appendChild(mainOption);
                subBreeds.forEach(subBreed => {
                    let option = document.createElement("option");
                    const value = `${mainBreed}-${subBreed}`; // e.g., 'retriever-golden'
                    option.value = value;
                    option.innerText = `-- ${formatBreedName(value)}`; 
                    breedList.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error("Failed to load breeds:", error);
        alert("Could not load dog breeds. Please check your internet connection.");
    }
}

function getBreedUrlFragment(breedValue) {
    if (breedValue.includes('-')) {
        const [main, sub] = breedValue.split('-');
        return `breed/${main}/${sub}`;
    }
    return `breed/${breedValue}`;
}

async function getBreedImage() {
    const breed = breedList.value;
    if (!breed) return;
    
    setLoading(true);
    imageContainer.innerHTML = ''; 
    moreImagesSection.innerHTML = ''; 

    try {
        const urlFragment = getBreedUrlFragment(breed);
        const response = await fetch(`https://dog.ceo/api/${urlFragment}/images/random`);
        const data = await response.json();
        
        setLoading(false);

        if (data.status !== 'success') {
            imageContainer.innerHTML = `<p class="error-message">Error fetching image: ${data.message}</p>`;
            return;
        }

        const img = document.createElement('img');
        img.src = data.message;
        img.alt = formatBreedName(breed);
        imageContainer.appendChild(img);

        let showMoreBtn = document.getElementById('showMoreBtn');
        if (!showMoreBtn) {
            showMoreBtn = document.createElement('button');
            showMoreBtn.id = 'showMoreBtn';
            showMoreBtn.innerText = 'Show 3 More Images';
            imageContainer.appendChild(showMoreBtn); 
        }
        
        const oldButton = document.getElementById('showMoreBtn');
        const newButton = oldButton.cloneNode(true);
        oldButton.parentNode.replaceChild(newButton, oldButton);

        newButton.addEventListener('click', () => getMoreImages(breed));

    } catch (error) {
        setLoading(false);
        imageContainer.innerHTML = `<p class="error-message">An error occurred while fetching the dog image.</p>`;
        console.error("Fetch error:", error);
    }
}

async function getMoreImages(breed) {
    setLoading(true);
    
    try {
        const urlFragment = getBreedUrlFragment(breed);
        const response = await fetch(`https://dog.ceo/api/${urlFragment}/images/random/3`);
        const data = await response.json();
        
        setLoading(false);

        if (data.status !== 'success') {
            console.error("Error fetching more images:", data.message);
            return;
        }

        data.message.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = formatBreedName(breed);
            moreImagesSection.appendChild(img);
        });

    } catch (error) {
        setLoading(false);
        console.error("Fetch error for more images:", error);
    }
}

function handlePageTransition() {
    loadBreeds();
    
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            mainApp.classList.remove('hidden');
            splashScreen.remove();
        }, 800); 
        
    }, 2000); 
}
getImageBtn.addEventListener("click", getBreedImage);
handlePageTransition();