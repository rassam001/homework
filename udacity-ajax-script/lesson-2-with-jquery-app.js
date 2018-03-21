/* eslint-env jquery */

(function () {
    const form = $('#search-form');
    const searchField = $('#search-keyword');
    let searchedForText;
    const responseContainer = $('#response-container');

    form.on('submit', function (e) {
        e.preventDefault();
        responseContainer.html('');
        searchedForText = searchField.val();
        // Image from Unsplash
        $.ajax({
          url:`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
          headers:{
            Authorization: 'Client-ID 8339da9e5173235a459aa484c0af5b5af314f724b25d713ef7efa3ab8bd80360'
          }
        }).done(addImage)
          .fail(function(err){ failRequest(err, 'Image'); });

        function addImage(data){
          let htmlContent = '';
          if(data && data.results && data.results[0]){
              htmlContent = `<figure>
                <img src="${data.results[0].urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${data.results[0].user.name}</figcaption>
                </figure>`;
          }else{
            htmlContent = `<div class="error-no-image">There is no Image for ${searchedForText}</div>`;
          }
          responseContainer.prepend(htmlContent);
        }
        function failRequest(err, item){
          htmlContent = `<div>Something goes WRONG with ${item}</div>`;
          responseContainer.append(htmlContent);
          console.log('lidhfkjhfkjsd');
        }

        // Articles from NYTimes

        $.ajax({
          url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&sort=newest&api-key=f15e31e851fd487e9a724521246acc88`
        }).done(addArticles)
          .fail(function(err){ failRequest(err, 'Articles'); });

        function addArticles(data){
          let htmlContent = '';
          if(data.response && data.response.docs && data.response.docs.length > 1){
            let articles = data.response.docs;
            htmlContent = '<ul>' + articles.map(article =>
              `<li class="article"><h2><a href="${article.web_url}">${article.headline.main}</a></h2></li>`
            ).join('') + '</ul>';
          }else {
            htmlContent = `<div class="error-no-articles">There is no Article for ${searchedForText}</div>`;
          }
          responseContainer.append(htmlContent);
        }

    });
})();
