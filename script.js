const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const pokemonListElement = document.getElementById('pokemon-list');
const searchInput = document.getElementById('search');
const typeFilter = document.getElementById('type-filter');
let allPokemon = [];

async function fetchPokemon() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    allPokemon = data.results;
    displayPokemon(allPokemon);
}

async function fetchPokemonDetails(pokemon) {
    const res = await fetch(pokemon.url);
    const data = await res.json();
    return data;
}

function displayPokemon(pokemon) {
    pokemonListElement.innerHTML = '';
    pokemon.forEach(async (pokemon) => {
        const data = await fetchPokemonDetails(pokemon);
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('pokemon');
        pokemonElement.innerHTML = `
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <h3>${data.name}</h3>
        `;
        pokemonListElement.appendChild(pokemonElement);
    });
}

searchInput.addEventListener('input', () => {
    filterAndDisplayPokemon();
});

typeFilter.addEventListener('change', () => {
    filterAndDisplayPokemon();
});

function filterAndDisplayPokemon() {
    const searchValue = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;

    const filteredPokemon = allPokemon.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(searchValue);
    });

    if (selectedType) {
        const typeFilteredPokemonPromises = filteredPokemon.map(async pokemon => {
            const data = await fetchPokemonDetails(pokemon);
            const types = data.types.map(typeInfo => typeInfo.type.name);
            if (types.includes(selectedType)) {
                return pokemon;
            }
        });

        Promise.all(typeFilteredPokemonPromises).then(typeFilteredPokemon => {
            const finalFilteredPokemon = typeFilteredPokemon.filter(pokemon => pokemon);
            displayPokemon(finalFilteredPokemon);
        });
    } else {
        displayPokemon(filteredPokemon);
    }
}

fetchPokemon();
