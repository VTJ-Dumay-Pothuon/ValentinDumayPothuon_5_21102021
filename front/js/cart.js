// Total quantity and total price of the cart are set as global variables
let totalQuantity = 0;
   let totalPrice = 0;

// Once these variable are set in the async fetch, they are displayed
function updateTotal (inCart, item) {
  totalQuantity += parseInt(inCart.quantity);
     totalPrice += parseInt(inCart.quantity) * parseInt(item.price);
  document.getElementById('totalQuantity').innerText = totalQuantity;
     document.getElementById('totalPrice').innerText = totalPrice;
}

// Whether it's incremented, decremented or the article is deleted,
// the article's quantity must be first substracted from the total
function removeFromTotal (inCart, item) {
  totalQuantity -= parseInt(inCart.quantity);
     totalPrice -= parseInt(inCart.quantity) * parseInt(item.price);
}

// Each article entry added to the cart is displayed thanks to this massive chunk of html
// #item is the article entry in the API catalogue, that contains the global settings
// #order is the article entry in the local storage, that contains the quantity and set color
function newArticle (item, order) {
  let cartItems = document.getElementById('cart__items') ;
  let article = document.createElement("ARTICLE");
  article.setAttribute("class", "cart__item");
  article.setAttribute("data-id", order.id);
  article.setAttribute("data-color", order.color)
  cartItems.appendChild(article);

  article.innerHTML = '<div class="cart__item__img">'
                    +'<img src="'+item.imageUrl
                    +'" alt="Photographie d’un canapé'+item.altTxt
                    +'"></div><div class="cart__item__content">'
                    +'<div class="cart__item__content__titlePrice">'
                    +'<h2>'      +item.name+' — '     +order.color
                    +'</h2><p>'  +item.price              ////
                    +' €</p></div><div class="cart__item__content__settings">'
                    +'<div class="cart__item__content__settings__quantity">'
                    +'<p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity"'
                    +' min="1" max="100" value="'     +order.quantity
                    +'"></div><div class="cart__item__content__settings__delete">'
                    +'<p class="deleteItem">Supprimer</p>'
                    +'</div></div></div>';
}


fetch('http://localhost:3000/api/products')

  .then(function (response) {
      //console.log(response.json());
      return response.json();
    })
  .catch(function (error) {
      console.log(error);
    })


  .then(function (data) {
    let cart = JSON.parse(localStorage.getItem('cart'));  
    for (let inCart of cart) {
        console.log(cart);
        
        for (let item of data) {
          // console.log(item);

          // Check if inCart article is valid and is the currently parsed item
          // Here the color doesn't matter. Just checking for API data to show
          if (inCart.id===item._id) {
            console.log("— "+inCart.quantity+" "+item.name+" "+inCart.color);
            
            newArticle (item, inCart) ;
            updateTotal(inCart, item) ;

            // Select the article block based on a pair of data parameters,
            // Then, find the quantity dropdown in the standardized structure
            let article = document.querySelectorAll(
            '[data-id="'+inCart.id+'"][data-color="'+inCart.color+'"]')[0];
            // console.log(article);
            let checkQuantity = article.children[1].children[1].children[0].children[1];
            // console.log(checkQuantity.value);

            // For each individual article-color pair, an event listener is put onto the quantity
            // On change, it updates the quantity in local storage, and reloads the total values
            checkQuantity.addEventListener('change', function() {
              // console.log(article);
              // First, temporarily remove the updated article from total
              removeFromTotal(inCart, item);

              // Second, update the quantity set in local storage
              inCart.quantity = checkQuantity.value;
              localStorage.setItem('cart', JSON.stringify(cart));
              // console.log(cart);
              // console.log("— "+inCart.quantity+" "+item.name+" "+inCart.color);

              // Third, re-add it to total, with the new quantity
              updateTotal(inCart, item);
            });


            // Add an event listener to the deleted button so that articles can be deleted
            let deleteArticle = article.children[1].children[1].children[1].children[0];
            deleteArticle.addEventListener('click', function() {
              removeFromTotal(inCart, item);
              inCart.quantity = "0";
              cart.splice(cart.indexOf(inCart), 1);
              localStorage.setItem('cart', JSON.stringify(cart));
              article.remove();
              updateTotal(inCart, item);
            });


            // Stop searching the article in the catalogue, as it's already found
            break;
          }
        }
    }
})
.catch(function (error) {
  console.log(error);
});