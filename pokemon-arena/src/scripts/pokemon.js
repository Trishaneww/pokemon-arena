const BASE_URL = 'https://img.pokemondb.net/sprites/home/normal/'
const API_URL = 'https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?'
const pokemonContainer = document.querySelector('#pokemon-container');
pokemonContainer.classList.add("hi");

const pokemonName = document.querySelector("#pokemon-name");
const pokemonHealth = document.querySelector("#pokemon-health");
const pokemonType = document.querySelector("#pokemon-type")
const attackContainer = document.querySelector("#pokemon-attack__container")
const pokemonImage = document.querySelector("#pokemon-img")
const readyBtn = document.querySelector("#ready-btn")
const playerCard = document.querySelector("#pokemon-card")


const cpuCard = document.querySelector("#pokemon-card2")
const cpuPokemonName = document.querySelector("#pokemon-name2");
const cpuPokemonHealth = document.querySelector("#pokemon-health2");
const cpuPokemonType = document.querySelector("#pokemon-type2")
const cpuAttackContainer = document.querySelector("#cpu-attack__container")
const cpuPokemonImage = document.querySelector("#pokemon-img2")


const header = document.querySelector(".battle__text");




async function getPokemonData (name) {
    const pokemon = await axios.get(`${API_URL}pokemon=${name}`)
    console.log(pokemon.data);
    const attacks = pokemon.data.moves;

    for (attack of attacks) {
        console.log(attack.name)

        if (attack.dp === undefined) {
            attack.dp = 0;
        }

        const attackbtn = document.createElement("button");
        attackbtn.innerText = attack.name;
        attackbtn.alt = attack.dp;
        attackbtn.classList.add("card__attack__button")
        attackContainer.append(attackbtn)

        attackbtn.addEventListener("click", () => {
            console.log(attackbtn.alt)
            cpuCard.classList.remove("hit")
            let cpuHealth = cpuPokemonHealth.innerText - attackbtn.alt;

            if (cpuHealth <= 0) {
                cpuPokemonHealth.innerText = '0';
                cpuCard.classList.add("shake");
                header.innerText = "YOU WIN!!!"
            } else {

                cpuPokemonHealth.innerText = cpuHealth;
                cpuCard.classList.add("hit");
            }
        })
    }

    pokemonHealth.innerText = pokemon.data.hp;
    pokemonName.innerText = name
    pokemonType.innerText= pokemon.data.info.type;
    pokemonImage.src = `${BASE_URL}${name}.png`;
}





async function cpu () {
    const cpupokemon = await axios.get(`${API_URL}pokedex=all`)
    const pokemons = cpupokemon.data;
    const myArray = pokemons.split("\n");

    let newArr = []
    for (p of myArray) {
        const [name, shortName] = p.split(':');
        console.log(shortName)
        newArr.push(shortName)
    }

    let random = Math.floor(Math.random() * 150);
    let pokemonName = newArr[random];

    


    const pokemon = await axios.get(`${API_URL}pokemon=${newArr[random]}`)
    console.log(pokemon.data);
    const attacks = pokemon.data.moves;

    for (attack of attacks) {
        console.log(attack.name)

        if (attack.dp === undefined) {
            attack.dp = 0;
        }

        const attackbtn = document.createElement("button");
        attackbtn.innerText = attack.name;
        attackbtn.alt = attack.dp;
        attackbtn.classList.add("card__attack__button")
        cpuAttackContainer.append(attackbtn)

        attackbtn.addEventListener("click", () => {
            console.log(attackbtn.alt)
            playerCard.classList.remove("hit")
            let playerHealth = pokemonHealth.innerText - attackbtn.alt;
            pokemonHealth.innerText = playerHealth;

            if (playerHealth <= 0) {
                pokemonHealth.innerText = '0';
                playerCard.classList.add("shake");
                header.innerText = "YOU LOSE!!!"
            } else {
                playerCard.classList.add("hit");
                pokemonHealth.innerText = playerHealth;
            }
        })
    }
    cpuPokemonHealth.innerText = pokemon.data.hp
    cpuPokemonName.innerText = pokemonName;
    cpuPokemonType.innerText= pokemon.data.info.type;
    cpuPokemonImage.src = `${BASE_URL}${pokemonName}.png`;  
}


readyBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    await cpu();
})


async function displayPokemon () {
    const pokemon = await axios.get(`${API_URL}pokedex=all`)
    const pokemons = pokemon.data;
    const myArray = pokemons.split("\n");

    let newArr = []
    for (p of myArray) {
        const [name, shortName] = p.split(':');
        newArr.push(shortName)
    }
    console.log(newArr)
    loop(newArr)
}


const loop = (pokemons) => {
    for (pokemon of pokemons) {
        const pokemonHolder = document.createElement('div');
        pokemonHolder.classList.add("pokemon-holder")
        const newPokemon = document.createElement('img')
        newPokemon.classList.add("pokemon");
        newPokemon.src = `${BASE_URL}${pokemon}.png`;
        newPokemon.alt = pokemon;
        pokemonHolder.append(newPokemon)
        pokemonContainer.append(pokemonHolder)

        newPokemon.addEventListener("click", async (e) => {
            e.preventDefault()
            console.log(newPokemon.alt)
            attackContainer.innerText = "";
            await getPokemonData(newPokemon.alt)
        })
    }
}

displayPokemon();