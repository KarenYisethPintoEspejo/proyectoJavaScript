
export const getAllListTracks = async (query) => {



    const url = `https://spotify23.p.rapidapi.com/search/?q=${query}&type=tracks&offset=0&limit=7`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0be03cf9femshc7b5238a1b6cbc7p13870ajsnde453bc0d701',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json()
        let lista=[];
        
        for(let cancion of result.tracks.items) {
            lista.push(cancion.data.uri)
        } 
        return lista;
    
    } catch (error) {
        console.error(error);
    }
}

