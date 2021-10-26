fetch('http://localhost:3000/api/products')


  .then(function (response) {
      //console.log(data.json());
      return response.json();
    })
  .catch(function (error) {
      console.log(error);
    })


  .then(function (data) {
      for (let item of data) {
        //console.log(item);

        let lien = document.createElement("A") ;
        lien.setAttribute("href", "./product.html?id="+item._id);
        document.getElementById('items').appendChild(lien);

        let article = document.createElement("ARTICLE") ;
        lien.appendChild(article);
        
        article.innerHTML =       '<img src="' + item.imageUrl
                                     +'"alt="' + item.altTxt
                 +'"><h3 class="productName">' + item.name
        +'</h3><p class="productDescription">' + item.description
        +'</p>' ;
      }
  })
  .catch(function (error) {
    console.log(error);
  });

