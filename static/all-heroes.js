import { generateAuth } from "./auth.js";

const heroesContainer = document.getElementById("herolist");
const next = document.querySelector("#next");
const prev = document.querySelector("#prev");
const isSearch = document.querySelector(".home-hero");

let nowShowing = isSearch.id;
let limit = 10;
let offset = 0;
let searchCount = 0;
let totalLimit = 0;
let heroThumbnail = "";

const auth = generateAuth();
const BASE_URL = "http://gateway.marvel.com/v1/public/characters?";

async function show(limit, offset){
    showLoadingSpinner();
    if(nowShowing === ""){
      let limitOffset = "limit=" + limit + "&offset=" + offset + "&";
      let heroesResult = await axios.get(BASE_URL + limitOffset + auth);
      let heroesArray = heroesResult.data.data.results;
      for(let i=0; i < limit; i++){
        heroThumbnail = heroesArray[i].thumbnail.path + "/portrait_incredible.jpg";
        createDivForHero(heroesArray[i].id, heroesArray[i].name, heroThumbnail);
      }
    }else{
        heroesContainer.innerHTML = "";
        let hero = await searchHero(nowShowing);
        console.log(hero);
        totalLimit = hero.length;
        while(hero[searchCount] && searchCount < totalLimit) {
            heroThumbnail = hero[searchCount].thumbnail.path + "/portrait_incredible.jpg";
            createDivForHero(hero[searchCount].id, hero[searchCount].name, heroThumbnail);
            searchCount++;
        }
    }
    hideLoadingSpinner();
}

async function searchHero(name){
    try{
        let response = await axios.get(BASE_URL + "name=" + name + "&" + auth);
        return response.data.data.results;
    }catch(error){
        console.error("Error fetching hero data:", error);
        return null;
    }
}

function createDivForHero(id, hero, image) {
    const newDiv = document.createElement("div");
    newDiv.className = "card";

    const cardContent = document.createElement("div");
    cardContent.className = "card-content";

    const heroImage = document.createElement("img");
    heroImage.className = "hero-image";
    heroImage.id = id;
    heroImage.src = image;
    heroImage.addEventListener("error", function(){
        this.src = "/static/logo.png";
    });

    const heroName = document.createElement("p");
    heroName.className = "hero-name";
    heroName.id = id;
    heroName.textContent = hero;

    cardContent.appendChild(heroImage);
    newDiv.appendChild(cardContent);
    newDiv.appendChild(heroName);

    newDiv.addEventListener('click', handleCardClick);

    heroesContainer.appendChild(newDiv);
}

function handleCardClick(event){
    let curHero = event.target.id;
    window.location.href = `/heroes/${curHero}`;
}

const loadingSpinner = document.getElementById('loading-spinner');

function showLoadingSpinner() {
  loadingSpinner.style.display = 'block';
  heroesContainer.style.display = "none";
  next.style.display = 'none';
  prev.style.display = 'none';
}

function hideLoadingSpinner() {
  loadingSpinner.style.display = 'none';
  heroesContainer.style.display = "flex";
  next.style.display = 'block';
  prev.style.display = 'block';
}

prev.addEventListener("click", function(){
    heroesContainer.innerHTML = "";
    if(nowShowing === ""){
        if(offset === 0){
            show(limit, offset);
        }else if(offset === 1560){
            limit = 10;
            offset = offset - 10;
            show(limit, offset);
        }else{
            offset = offset - 10;
            show(limit, offset);
        }
    }else{
      window.location.href = `/heroes`;
    }
})

next.addEventListener("click", function(){
    heroesContainer.innerHTML = "";
    if(nowShowing === ""){
        if(offset > 1564){
            show(limit, offset);
        }else if(offset < 1550){
          offset = offset + 10;
          show(limit, offset);
        }else if(offset === 1550){
            offset = offset + 10;
            limit = 4;
            show(limit, offset);
        }else{
          show(limit, offset);
        }
    }else{
      window.location.href = `/heroes`;
    }
})

show(limit, offset);

