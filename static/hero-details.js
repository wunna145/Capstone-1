import { key } from "./key.js";

const BASE_URL = "https://superheroapi.com/api/" + key + "/";
const hero = document.getElementsByClassName("profile-container");
const id = hero[0].id;

async function getHeroInfo(id){
    try{
        let response = await axios.get(BASE_URL + id);
        return response.data;
    }catch(error){
        console.error("Error fetching hero data:", error);
        return null;
    }
}

async function makeProfile(){
    const stats = document.getElementsByClassName("stats-container");

    let heroInfo = await getHeroInfo(id);

    let profile = document.createElement("div");
    profile.className = 'profile';

    let img = document.createElement("img");
    img.src = heroInfo.image.url;
    img.id = "profile-avatar";
    img.addEventListener("error", function(){
        this.src = "/static/logo.png";
    });

    let name = document.createElement("h1");
    name.innerText = heroInfo.name;
    
    profile.append(img, name)
    stats[0].appendChild(profile);

    let pStats = powerstats(
        heroInfo.powerstats.intelligence,
        heroInfo.powerstats.strength,
        heroInfo.powerstats.speed,
        heroInfo.powerstats.durability,
        heroInfo.powerstats.power,
        heroInfo.powerstats.combat
        );
    
    stats[0].appendChild(pStats);

    let bio = biography(
        heroInfo.biography["full-name"],
        heroInfo.biography["alter-egos"],
        heroInfo.biography.aliases,
        heroInfo.biography["place-of-birth"],
        heroInfo.biography["first-apperance"],
        heroInfo.biography.publisher,
        heroInfo.biography.alignment
    );

    stats[0].appendChild(bio);

    let app = appearance(
        heroInfo.appearance.gender,
        heroInfo.appearance.race,
        heroInfo.appearance.height,
        heroInfo.appearance.weight,
        heroInfo.appearance["eye-color"],
        heroInfo.appearance["hair-color"],
    );

    stats[0].appendChild(app);

    let wok = work(
        heroInfo.work.occupation,
        heroInfo.work.base
    );

    stats[0].appendChild(wok);

    let con = connections(
        heroInfo.connections["group-affiliation"],
        heroInfo.connections.relatives
    );

    stats[0].appendChild(con);
}

function powerstats(intelligence, strength, speed, durability, power, combat){

    let stats = document.createElement("div");
    stats.className = 'stats';

    let header = document.createElement("h1");
    header.innerText = "Stats";
    header.className = 'txt';

    let intel = document.createElement("p");
    intel.innerText = "Intelligence : " + intelligence;
    intel.className = 'txt';

    let str = document.createElement("p");
    str.innerText = "Strength : " + strength;
    str.className = 'txt';

    let spd = document.createElement("p");
    spd.innerText = "Speed : " + speed;
    spd.className = 'txt';

    let dur = document.createElement("p");
    dur.innerText = "Durability : " + durability;
    dur.className = 'txt';

    let pw = document.createElement("p");
    pw.innerText = "Power : " + power;
    pw.className = 'txt';

    let cmb = document.createElement("p");
    cmb.innerText = "Combat : " + combat;
    cmb.className = 'txt';

    stats.append(header, intel, str, spd, dur, pw, cmb);

    return stats;

}

function biography(fullname, alteregos, aliases, placeOfBirth, firstApperance, publisher, alignment){

    let bio = document.createElement("div");
    bio.className = 'stats';

    let header = document.createElement("h1");
    header.innerText = "Biography";
    header.className = 'txt';

    let name = document.createElement("p");
    name.innerText = "Fullname : " + fullname;
    name.className = 'txt';

    let aE = document.createElement("p");
    aE.innerText = "Alter-egos : " + alteregos;
    aE.className = 'txt';

    let alia = document.createElement("p");
    alia.innerText = "Aliases : " + aliases;
    alia.className = 'txt';

    let pob = document.createElement("p");
    pob.innerText = "Place-of-birth : " + placeOfBirth;
    pob.className = 'txt';

    let fstApp = document.createElement("p");
    fstApp.innerText = "First-apperance : " + firstApperance;
    fstApp.className = 'txt';

    let pub = document.createElement("p");
    pub.innerText = "Publisher : " + publisher;
    pub.className = 'txt';

    let align = document.createElement("p");
    align.innerText = "alignment : " + alignment;
    align.className = 'txt';

    bio.append(header, name, aE, alia, pob, fstApp, pub, align);

    return bio;

}

function appearance(gender, race, height, weight, eyeColor, hairColor){

    let app = document.createElement("div");
    app.className = 'stats';

    let header = document.createElement("h1");
    header.innerText = "Apperance";
    header.className = 'txt';

    let gen = document.createElement("p");
    gen.innerText = "Gender : " + gender;
    gen.className = 'txt';

    let rac = document.createElement("p");
    rac.innerText = "Race : " + race;
    rac.className = 'txt';

    let h = document.createElement("p");
    h.innerText = "Height : " + height;
    h.className = 'txt';

    let w = document.createElement("p");
    w.innerText = "Weight : " + weight;
    w.className = 'txt';

    let eColor = document.createElement("p");
    eColor.innerText = "Eye-color : " + eyeColor;
    eColor.className = 'txt';

    let hColor = document.createElement("p");
    hColor.innerText = "Hair-color : " + hairColor;
    hColor.className = 'txt';

    app.append(header, gen, rac, h, w, eColor, hColor);

    return app;

}

function work(occupation, base){

    let wok = document.createElement("div");
    wok.className = 'stats';

    let header = document.createElement("h1");
    header.innerText = "Work";
    header.className = 'txt';

    let opt = document.createElement("p");
    opt.innerText = "Occupation : " + occupation;
    opt.className = 'txt';

    let bas = document.createElement("p");
    bas.innerText = "Base : " + base;
    bas.className = 'txt';

    wok.append(header, opt, bas);

    return wok;

}

function connections(groupAffiliation, relatives){

    let con = document.createElement("div");
    con.className = 'stats';

    let header = document.createElement("h1");
    header.innerText = "Connections";
    header.className = 'txt';

    let gpAfl = document.createElement("p");
    gpAfl.innerText = "Group-affiliation : " + groupAffiliation;
    gpAfl.className = 'txt';

    let rel = document.createElement("p");
    rel.innerText = "Relatives : " + relatives;
    rel.className = 'txt';

    con.append(header, gpAfl, rel);

    return con;

}

makeProfile();