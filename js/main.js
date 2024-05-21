
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
                <link rel="stylesheet" href="css/style.css">
                <iframe class="spotify-iframe" width="auto" height="800" src="https://open.spotify.com/embed/album/${id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
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
                'X-RapidAPI-Key': '0be03cf9femshc7b5238a1b6cbc7p13870ajsnde453bc0d701',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };  

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            let templates = '';
            console.log("data", result);
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



let cancionesContainer = document.querySelector(".pistas__totales");

// import {getAllTopChart} from  "./modules/now-playing.js"
import {getAllListTracks} from "./components/getAllTracks.js"

let buscador = document.querySelectorAll ("input")

buscador[1].addEventListener("keyup", async function(event) {
    if (event.key == "Enter") {
        cancionesContainer.innerHTML="";
        const query = event.target.value; // Obtener el valor del campo de búsqueda
        const playlists = await getAllListTracks(query);
        for (let playlist of playlists){
             let idAlbum = playlist.split(":")[2];
            cancionesContainer.innerHTML+= `
            <div class="iframe-wrapper"> 
                        <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${idAlbum}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    </div>
            `;
        }
        console.log(playlists);
    }
});

window.onresize = manageResize

function manageResize(){
    if (window.innerWidth < 900) {
        console.log("VERISON MOVIL");
    }
    else{
        console.log("VERION DESKTOP");
       
    }
}




