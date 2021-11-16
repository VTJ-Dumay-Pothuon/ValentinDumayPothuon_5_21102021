// Get the id parameter from URL
const queryString = window.location.search;
// console.log(queryString);
const id = new URLSearchParams(queryString).get('id');
// console.log(id);

function getColor () {
  // Get the color value from the dropdown list
  const selectedColor = document.getElementById('colors');
  const color = selectedColor.options[selectedColor.selectedIndex].text;

  // Safety check if the color is not set
  if(color==="--SVP, choisissez une couleur --") {
    alert("La couleur n'est pas définie !");return;}
  // console.log("Added item color: "+color);

  return color;
}


function getQuantity () {
  // Get set quantity value as an integer
  let quantity = document.getElementById('quantity').value;
  
  // Safety check if the quantity is between 1 and 100
  if (quantity < 1 || quantity > 100) {
    alert("La quantité doit être comprise entre 1 et 100 !");return;}
  // console.log("Added item quantity: "+quantity);

  return quantity
}


function newCart (article) {
  // console.log("New cart created");
  let orderedItems = [];
  orderedItems.push(article);
  localStorage.setItem('cart', JSON.stringify(orderedItems));
}


// If an article with the same ID and color is found in the local Storage cart,
// Its quantity is incremented by set quantity. Else, returns true.
function incrementArticle (article) {
  let newArticle = true;
  // console.log(localStorage.getItem('cart'));
  let cart = JSON.parse(localStorage.getItem('cart'));
  for (let inCart of cart) {
    if (inCart.id===article.id && inCart.color===article.color) {
      // console.log("The article is already in cart. Incrementing quantity...");
      inCart.quantity = parseInt(inCart.quantity) + parseInt(article.quantity);
      localStorage.setItem('cart', JSON.stringify(cart));
      newArticle = false;
      break;
    }
  }
  // Returns true if nothing happened,
  // false if the article was incremented
  return newArticle;
}


function addToCart () {
  // Safety check if the id is invalid or the page didn't load well
  if(document.getElementById('title').innerText==="undefined") {
    alert("Cet article n'existe pas !");return;}
  // console.log("Added item ID: "+id);
  
  const color = getColor();
  if (!(color)) return;

  const quantity = getQuantity();
  if (!(quantity)) return;

  // Create a simplified object to symbolize the article
  let article = {id: id, color: color, quantity: quantity};
  //localStorage.removeItem('cart');
  
  // Create an empty cart if not already done
  if (localStorage.getItem('cart')===null) {
    newCart (article);

  } else {
    // First check if the article is already in the cart ;
    // If it does, increment the quantity set in local storage
    const newArticle = incrementArticle(article);

    //Else the article is new, so add it to the cart
    if (newArticle) {
      // console.log("The article is new. add to cart...");
      let orderedItems = JSON.parse(localStorage.getItem('cart'));
      orderedItems.push(article);
      localStorage.setItem('cart', JSON.stringify(orderedItems));
    }
  }
  // console.log(localStorage.getItem('cart'));
  window.location.href = './cart.html';
}


// Add queried item informations to the html structure
function setArticleContent (item) {
  document.getElementById('title').innerText       = item.name;
  document.getElementById('price').innerText       = item.price; 
  document.getElementById('description').innerText = item.description; 
  document.getElementsByClassName('item__img')[0].innerHTML = 
                                      '<img src="' + item.imageUrl
                                        +'" alt="' + item.altTxt
                                        +'"></img>';
}


function setColors (item) {
  for (let color of item.colors) {
    let newColor = document.createElement("OPTION");
    newColor.setAttribute("value", color);
    newColor.innerText = color;
    document.getElementById('colors').appendChild(newColor);
  }
}


// Select the article associated with given id
fetch('http://localhost:3000/api/products/'+id)

  .then(function (response) {
   // console.log(response.json());
      return response.json();
    })
  .catch(function (error) {
      console.log(error);
    })

  
  .then(function (item) {
    // console.log(item);

    try {
      // 1. Try to input the article's parameters, only if the id is valid
      setArticleContent(item) ;

      // 2. Put each available colors into the selection droplist
      setColors(item);
      
    } catch (error) {
        console.log(error);
    }
      // 3. Set command item. This is out of the "Try" so that it'll work
      //    for an invalid article too (and send an appropriate error popup)
      document.getElementById('addToCart').addEventListener('click', addToCart);
})