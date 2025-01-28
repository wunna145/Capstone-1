import { generateAuth } from "./auth.js";

const auth = generateAuth();
const BASE_URL = "https://gateway.marvel.com/v1/public/characters?id=";
const hero = document.getElementsByClassName("profile-container");
const id = hero[0].id;

async function getHeroInfo(id){
    try{
        let response = await axios.get(BASE_URL + id + "&" + auth);
        return response.data.data.results[0];
    }catch(error){
        console.error("Error fetching hero data:", error);
        return null;
    }
}

async function makeProfile(){
    const resources = document.getElementsByClassName("stats-container");

    let heroInfo = await getHeroInfo(id);

    let profile = document.createElement("div");
    profile.className = 'profile';

    let img = document.createElement("img");
    img.src = heroInfo.thumbnail.path + "/portrait_incredible.jpg";
    img.id = "profile-avatar";
    img.addEventListener("error", function(){
        this.src = "/static/logo.png";
    });

    let name = document.createElement("h1");
    name.innerText = heroInfo.name;

    let comic = document.createElement("a");
    const comicLink = heroInfo.urls.find(urlObj => urlObj.type === "comiclink");
    comic.className = "herocomic";
    comic.href = comicLink.url;
    comic.target = "_blank";
    comic.innerText = "Let's go to comics";
    
    profile.append(img, name, comic)
    resources[0].appendChild(profile);
}

makeProfile();