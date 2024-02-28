let searhForm = document.getElementById("Searchform");
let header = document.querySelector('.header')
let SearchArea = document.getElementById("Searcharea");
let searchBtn = document.getElementById("searchbutton");
let imageContainer = document.getElementById("imagecontainer");
let loadmoreBtn = document.getElementById("loadmorebtn");
let accesKey = "Pbh1B2iN-Np8bXsoy84IST4lMcx5olIzJ4DEADy_718";
let keyword = "";
let page = 1;

// searching images based on keywords
function searchImage() {
  keyword = SearchArea.value;
  fetch(
    `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&orientation=landscape&client_id=${accesKey}&per_page=6`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let results = data.results;
      if (page === 1) {
        imageContainer.innerHTML = "";
      }
      if (results.length !== 0) {
        header.innerHTML = `Results related ${keyword}`
        loadmoreBtn.style.display = "block";
      } else {
        imageContainer.innerHTML = "No images found";
      }
      if(SearchArea.value === ''){
        header.innerHTML = `<h1><span>Search</span> any <span>image</span></h1>`
      }
      results.forEach((result) => {
        let image = document.createElement("img");
        image.src = result.urls.small;
        image.id = "images";
        imageContainer.appendChild(image);
      });

      console.log(results);
    });
}

searhForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchImage();
});

searchBtn.addEventListener("click", () => {
  searchImage();
});

// load more button increases page numbers and calls search new images
loadmoreBtn.addEventListener("click", () => {
  page++;
  searchImage();
  // console.log(data);
});

let orientations = document.getElementById('orientations')
let potrait = document.getElementById('potrait')
let landscape = document.getElementById('landscape')
