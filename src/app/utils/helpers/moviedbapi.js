const apiKey = "3a9e6cc51801d61e4f390cf3193bc623";

/**
 * Send request and return json response
 * @param {*} type 1 - popular, 2 - similar, 3 - search, 4 - details, 5 - genre list 
 * @param {*} page 
 * @param {*} query - search word for type 3
 * @param {*} movieID  for type 2 and 4
 * @param {*} api_key 
 */

export function get(type, page = 1, query, movieID, api_key = apiKey) {
    let request = '';
    let errorMessage = '';
    switch (type) {
        case 1:   //popular
        errorMessage = 'popular error';
        request = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=ru-ru&page=${page}`;
        break;
        case 2:    //similar
        errorMessage = 'similar error';
        request = `https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=${api_key}&language=ru-ru&page=1`
        break;
        case 3:    //search
        errorMessage = 'search error';
        request =  `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=ru-ru&query=${query}&page=${page}`;
        break;
        case 4:  //details
        errorMessage = 'details error';
        request = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${api_key}&language=ru-ru`;
        break;
        case 5: //genreList
        errorMessage = 'details error';
        request = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ru-ru`;
    }    
    return new Promise((resolve, reject) => {
        fetch(request).then(response => {
            try {
                if (response.status !== 200)
                throw new Error(errorMessage);
                resolve(response.json());
            }
            catch (e) {
                reject(e.message);
            }
        });
    });   
    
}


