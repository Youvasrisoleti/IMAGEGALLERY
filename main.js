const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const ligthBox = document.querySelector(".lightbox");
const ligthBoxCloseIcon = document.querySelector(".buttons .close");
const ligthBoxDownloadIcon = document.querySelector(".buttons .download");

// the api key .
const apiKey = "jjB2E5JN1JGfwT01ybvozsiZJCByKd1cSE75lYWQ0iyVYu2KHOmITmE3";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;


//downloading the slected image 
const downloadImg = (imgURL) => {
    fetch(imgURL).then(result => result.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();

        
    }).catch(() => alert("Cant Download image!"));

}

const showlightbox = (name, img) => {
    ligthBox.querySelector("img").src = img;
    ligthBox.querySelector("span").innerText = name;
    ligthBox.classList.add("show");
    document.body.style.overflow = "hidden";

    ligthBoxDownloadIcon.setAttribute("data-img", img);
}

// genrate the image card and append it to the image wrapper.
const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img =>
        `       <li class="card" onclick="showlightbox('${img.photographer}','${img.src.large2x}')">
                <img src="${img.src.large2x} alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick="downloadImg('${img.src.large2x}')"><i class="uil uil-import"></i></button>
                </div>
            </li>`
    ).join("")
    
};

// fetch the images form the api .
const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Loding.....";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization : apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Loade More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(()=> alert("Faild to load images!"))
};


// load more images function.
const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
};

// get images by searching it
const loadSearchImages = (e) => {
    if (e.target.value === "") return searchTerm = null;

    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
    
};



getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);

// closing the light box on click the close icon
ligthBoxCloseIcon.addEventListener("click", () => {
    ligthBox.classList.remove("show");
    document.body.style.overflow="auto";
});

ligthBoxDownloadIcon.addEventListener("click",(e)=>downloadImg(e.target.dataset.img));