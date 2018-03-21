(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const unsplashRequest = new XMLHttpRequest();

        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function(err){ requestError(err, 'Image'); };
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 8339da9e5173235a459aa484c0af5b5af314f724b25d713ef7efa3ab8bd80360');
        unsplashRequest.send();

        function addImage(){
          const data = JSON.parse(this.responseText);
          let htmlContent = '';
          if(data && data.results && data.results[0]){
              htmlContent = `<figure>
                <img src="${data.results[0].urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${data.results[0].user.name}</figcaption>
                </figure>`;
          }else{
            htmlContent = `<div class="error-no-image">There is no Image for ${searchedForText}</div>`;
          }
          responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }


        const nytimesRequest = new XMLHttpRequest();
        nytimesRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&sort=newest&api-key=f15e31e851fd487e9a724521246acc88`);
        nytimesRequest.onload = addArticle;
        nytimesRequest.onerror = function(err){ requestError(err, 'Articles');};
        nytimesRequest.send();

        function addArticle(){
          const data = JSON.parse(this.responseText);
          let htmlContent = '';
          if(data.response && data.response.docs && data.response.docs.length > 1){
            htmlContent = '<ul>' + data.response.docs.map(function(article){
              return `<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                </li>`;
            }).join('') + '</ul>';
          }else {
            htmlContent = `<div class="error-no-articles">There is no Article for ${searchedForText}</div>`;
          }
          responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        function requestError(err, elet){
          console.log(err);
          responseContainer.innerHTML += '<div>Something goes WRONG with '+ elet + '</div>';
        }
    });
})();
