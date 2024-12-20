import { key } from "./key.js";

const heroesContainer = document.getElementById("herolist");
const next = document.querySelector("#next");
const prev = document.querySelector("#prev");
const isSearch = document.querySelector(".home-hero");

let nowShowing = isSearch.id;
let counter = 1;
let searchCount = 0;
let searchLimit = 10;
let totalLimit = 0;
let reachEnd = 0;

const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
const BASE_URL = PROXY_URL + "https://superheroapi.com/api/" + key + "/";

async function getHero(id){
    try{
        let response = await axios.get(BASE_URL + id + '/image');
        return response.data;
    }catch(error){
        console.error("Error fetching hero data:", error);
        return null;
    }
}

async function searchHero(name){
    try{
        let response = await axios.get(BASE_URL + 'search/' + name);
        return response.data;
    }catch(error){
        console.error("Error fetching hero data:", error);
        return null;
    }
}

async function show(s){
    showLoadingSpinner();
    if(nowShowing === ""){
        for (let i = s; i < (s+10); i++) {
            let hero = await getHero(i);
            if (hero) {
              createDivForHero(hero.id, hero.name, hero.url);
            }
        }
    }else{
        heroesContainer.innerHTML = "";
        let hero = await searchHero(nowShowing);
        totalLimit = hero.results.length;
        console.log("before while ", searchCount, searchLimit, hero.response, totalLimit, reachEnd);
        while(hero.response === "success" && hero.results[searchCount] && searchCount < searchLimit) {
            console.log("in while ", searchCount, searchLimit, hero.response);
            createDivForHero(hero.results[searchCount].id, hero.results[searchCount].name, hero.results[searchCount].image.url);
            searchCount++;
        }
    }
    hideLoadingSpinner();

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
        if(counter === 1){
            show(counter);
        }else{
            counter = counter - 10;
            show(counter);
        }
    }else{
        nowShowing = nowShowing;

        if(searchCount%10 != 0){
            searchCount = searchCount - 10 - (searchCount%10);
            searchLimit = searchLimit - 10;
        }else if(reachEnd != 0 && searchLimit > 10){
            searchCount = searchCount - (10 + reachEnd);
            searchLimit = searchLimit - 10;
        }else if(searchLimit > 10){
            searchLimit = searchLimit - 10;
            searchCount = searchCount - 20;
        }else{
            searchLimit = 10;
            searchCount = 0;
        }
        reachEnd = 0;
        show(counter);
    }
})

next.addEventListener("click", function(){
    heroesContainer.innerHTML = "";
    if(nowShowing === ""){
        if(counter === 731){
            show(counter);
        }else{
            counter = counter + 10;
            show(counter);
        }
    }else{
        nowShowing = nowShowing;
        if(totalLimit > searchLimit){
            searchLimit = searchLimit + 10;
        }else{
            searchCount = searchLimit - 10;
            reachEnd = (totalLimit)%10;
        }
        show(counter);
    }
})

show(counter);

