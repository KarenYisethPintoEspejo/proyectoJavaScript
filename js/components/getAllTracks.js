export const getAllListTracks = async (query) => {



    const url = `https://spotify23.p.rapidapi.com/search/?q=${query}&type=tracks&offset=0&limit=7`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9acfc943dfmsh2dbdbbe8c4bf3c8p120f44jsn0578b09a8f6b',
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