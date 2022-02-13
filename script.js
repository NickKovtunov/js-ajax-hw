let searcher = document.getElementById('searcher');
let suggests = document.getElementById('suggests');
let selected = document.getElementById('selected');
let histories = document.getElementById('histories');

window.onload = function() {
    if(localStorage.getItem('allFilms') === null){
        localStorage.setItem('allFilms', JSON.stringify([]));
    }
    if(localStorage.getItem('notRepeatedFilms') === null){
        localStorage.setItem('notRepeatedFilms', JSON.stringify([]));
    }
    changeHistory();
};

searcher.oninput = function() {
    let query = this.value.toLowerCase();
    if (query.length >= 3) {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=3cb53b3349a17a17e7c0b04f0a74310b&query=` + query)
            .then((response) => response.json())
            .then((response) => addSuggests(response.results, query));
    }
};

function addSuggests(items, query) {
    suggests.innerHTML = '';
    
    let oldRequests = JSON.parse(localStorage.getItem('notRepeatedFilms'));
    let count = 0
    for (let i = 0; count < 5 && i < oldRequests.length; i++) {
        if(oldRequests[i].original_title.toLowerCase().indexOf(query) >= 0){
            count = count + 1
            suggests.innerHTML += `<div class="search_suggest__item old-result" data-id="${oldRequests[i].id}" data-title="${oldRequests[i].original_title}" data-description="${oldRequests[i].overview}" data-image="${oldRequests[i].poster_path}">${oldRequests[i].original_title}</div>`;
        }
    };

    for (let i = 0; count < 10 && i < items.length; i++) {
        count = count + 1
        suggests.innerHTML += `<div class="search_suggest__item" data-id="${items[i].id}" data-title="${items[i].original_title}" data-description="${items[i].overview}" data-image="${items[i].poster_path}">${items[i].original_title}</div>`;
    };
}

suggests.onclick = function(e) {
    suggests.innerHTML = '';
    let id = e.target.dataset.id;
    let title = e.target.dataset.title;
    let description = e.target.dataset.description;
    let image = e.target.dataset.image;
    selected.innerHTML = '<p class="selected_title">' + title + '</p>';
    if(image != null && image != "null"){
        selected.innerHTML = selected.innerHTML + '<img src="https://image.tmdb.org/t/p/w94_and_h141_bestv2' + image + '" class="selected_poster">';
    }
    selected.innerHTML = selected.innerHTML + '<p class="selected_description">' + description + '</p>';
    searcher.value = '';
    changeLocalStorage(id, title, description, image);
};

function changeLocalStorage(id, title, description, image) {
    let allFilms = JSON.parse(localStorage.getItem('allFilms'));
    allFilms.push({'id':id,'original_title': title,'overview': description,'poster_path': image});
    localStorage.setItem('allFilms', JSON.stringify(allFilms));
    changeHistory();

    let notRepeatedFilms = JSON.parse(localStorage.getItem('notRepeatedFilms'));
    if(!notRepeatedFilms.find(item => item.id == id)){
        notRepeatedFilms.push({'id':id,'original_title': title,'overview': description,'poster_path': image});
        localStorage.setItem('notRepeatedFilms', JSON.stringify(notRepeatedFilms));
    }
}

window.addEventListener('storage', () => {
    changeHistory();
});

function changeHistory() {
    let localStorageArray = JSON.parse(localStorage.getItem('allFilms'));
    histories.innerHTML = ""
    let i = 1
    while (i <= 3) {
        if(localStorageArray.length - i >= 0){
            let title = localStorageArray[localStorageArray.length - i].original_title
            histories.innerHTML = histories.innerHTML + '<p class="results_item">' + title +  '</p>';
            i = i+1;
        }else{
            break
        }
    }
}