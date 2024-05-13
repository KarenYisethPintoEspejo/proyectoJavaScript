class myframe extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.renderFrame();
    }

    renderFrame() {
        const uri = this.getAttribute('uri');
        if (uri) {
            // Obtener el ID del álbum de la URI
            const id = uri.split(':')[2];
            this.shadowRoot.innerHTML = `
                <iframe class="spotify-iframe" width="700" height="800" src="https://open.spotify.com/embed/album/${id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            `;
        } else {
            this.shadowRoot.innerHTML = '';
        }
    }

    static get observedAttributes() {
        return ["uri"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'uri' && oldVal !== newVal) {
            this.renderFrame();
        }
    }
}
customElements.define("my-frame",myframe)


class albumGallery extends HTMLElement {
    constructor() {
        super();
    }
    
    async connectedCallback() {
        const searchInput = document.querySelector('.search__album input');

        document.querySelector('.search__album button').addEventListener('click', async () => {
            const searchTerm = searchInput.value.trim();
            const url = `https://spotify23.p.rapidapi.com/search/?q=${searchTerm}&type=albums&offset=0&limit=8`;

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                updateAlbumGallery(result.albums.items);
            } catch (error) {
                console.error(error);
            }
        });

        function updateAlbumGallery(albums) {
            let templates = '';
            for (let i = 0; i < Math.min(8, albums.length); i++) {
                if (albums[i].data && albums[i].data.coverArt && albums[i].data.coverArt.sources && albums[i].data.coverArt.sources.length > 0) {
                    const primeraUrl = albums[i].data.coverArt.sources[0].url;
                    const uri = albums[i].data.uri;
                    const id = uri.split(':')[2];
                    templates += `
                        <img id="album__${i + 1}" src="${primeraUrl}" alt="" data-id="${id}">
                    `;
                }
            }
            document.querySelector('.albumGallery').innerHTML = templates;
            document.querySelectorAll('.albumGallery img').forEach(img => {
                img.addEventListener('click', () => {
                    const id = img.dataset.id;
                    const myFrame = document.querySelector('.main__frame');
                    myFrame.setAttribute('uri', `spotify:album:${id}`);
                });
            });
        }
        
        const url = 'https://spotify23.p.rapidapi.com/search/?q=morat%20&type=albums&offset=0&limit=8';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '9acfc943dfmsh2dbdbbe8c4bf3c8p120f44jsn0578b09a8f6b',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };  

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            let templates = '';
            for (let i = 0; i < Math.min(8, result.albums.items.length); i++) {
                if (result.albums.items[i].data && result.albums.items[i].data.coverArt && result.albums.items[i].data.coverArt.sources && result.albums.items[i].data.coverArt.sources.length > 0) {
                    const primeraUrl = result.albums.items[i].data.coverArt.sources[0].url;
                    const uri = result.albums.items[i].data.uri;
                    const id = uri.split(':')[2];
                    templates += `
                        <img id="album__${i + 1}" src="${primeraUrl}" alt="" data-id="${id}">
                    `;
                }
            }
            this.innerHTML = templates;
            this.querySelectorAll('img').forEach(img => {
                img.addEventListener('click', () => {
                    const id = img.dataset.id;
                    const myFrame = document.querySelector('.main__frame');
                    myFrame.setAttribute('uri', `spotify:album:${id}`);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}

customElements.define('album-gallery', albumGallery);




class likeSection extends HTMLElement {
    constructor() {
        super();
    }
    
    async connectedCallback() {
        // Realizar la solicitud fetch a la API
        const url = 'https://spotify23.p.rapidapi.com/search/?q=morat%20&type=albums&offset=0&limit=8';
        const options = {
        method: 'GET',
            headers: {
                'X-RapidAPI-Key': '9acfc943dfmsh2dbdbbe8c4bf3c8p120f44jsn0578b09a8f6b',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        }; 

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            // Crear una variable para almacenar las plantillas HTML
            let templates = '';
            
            // Iterar sobre los primeros 6 álbumes
            // Verificar si hay resultados de playlists
            if (result && result.playlists && result.playlists.items) {
                // Iterar sobre cada playlist
                result.playlists.items.slice(0, 6).forEach(playlist => {
                    // Extraer la primera URL dentro de "sources"
                    const primeraUrl = playlist.data.images.items[0].sources[0].url;
                    // Extraer los objetos "name" y "description"
                    const nombre = playlist.data.name;
                    let descripcion = playlist.data.description;

                    // Limitar la descripción si es necesario
                    if (descripcion.length > 200) {
                        descripcion = descripcion.substring(0, 50 - 3) + '...';
                    }
                    // Imprimir los resultados
                    templates += `
                        <div class="mayLikeSongs">
                            <img src="${primeraUrl}" alt="" >
                            <div class="mayLikeName">
                                <p>${nombre}</p>
                                <p class="descritionMayLike">"${descripcion}"</p>
                            </div>
                            <p>time 11:00</p>
                        </div>
                    `;
                });
            } else {
                console.log('No se encontraron resultados de playlist en la respuesta.');
            }

            // Insertar las plantillas en la clase "albumGallery" del HTML
            this.innerHTML = templates;
        } catch (error) {
            console.error(error);
        }
    }
}

customElements.define('may-like', likeSection);


function searchSpotify() {
    var searchQuery = document.getElementById("searchInput").value;
    // Realizar la solicitud a la API de Spotify
    $.ajax({
        url: "https://api.spotify.com/v1/search",
        data: {
            q: searchQuery,
            type: "track"
        },
        headers: {
            "Authorization": "Bearer YOUR_ACCESS_TOKEN"
        },
        success: function(response) {
            displaySongs(response.tracks.items);
        }
    });
}

function displaySongs(songs) {
    var songListElement = document.getElementById("songList");
    songListElement.innerHTML = ""; // Limpiar la lista de canciones antes de mostrar los nuevos resultados

    songs.forEach(function(song) {
        var songElement = document.createElement("div");
        songElement.classList.add("track__songsName");

        var songHTML = `
            <i class='bx bx-menu'></i>
            <img src="${song.album.images[0].url}" alt="${song.name}">
            <div class="track__description">
                <div>
                    <h4>${song.name}</h4>
                    <p>${song.artists[0].name}</p>
                </div>
                <div class="track__time">
                    <p class="track__hora">${song.duration_ms}</p>
                    <p class="track__año">${song.album.release_date}</p>
                </div>
            </div>
        `;
        songElement.innerHTML = songHTML;
        songListElement.appendChild(songElement);
    });
}
