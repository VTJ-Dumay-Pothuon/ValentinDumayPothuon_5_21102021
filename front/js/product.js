// Get the id parameter from URL
const queryString = window.location.search;
// console.log(queryString);
const id = new URLSearchParams(queryString).get('id');
// console.log(id);

fetch('http://localhost:3000/api/products')


  .then(function (response) {
   // console.log(response.json());
      return response.json();
    })
  .catch(function (error) {
      console.log(error);
    })

  
  // Select the article associated with given id
  .then(function (data) {
   // console.log(data);
      let item = null;
      for (let article of data) {
        // console.log(item);
        if (article._id === id) {
            item = article;
            break;
        }
      }

      try {
        // Try to input the article's parameters, only if the id is valid
        document.getElementById('title').innerText       = item.name;
        document.getElementById('price').innerText       = item.price; 
        document.getElementById('description').innerText = item.description; 
        document.getElementsByClassName('item__img')[0].innerHTML = 
                                            '<img src="' + item.imageUrl
                                              +'" alt="' + item.altTxt
                                              +'"></img>';

        // put each available colors into the selection droplist
        for (let color of item.colors) {
          let newColor = document.createElement("OPTION");
          newColor.setAttribute("value", color);
          newColor.innerText = color;
          document.getElementById('colors').appendChild(newColor);
        }
    } catch (error) {
        console.log(error);
    }
  })


function addToCart () {
  // Safety check if the id is invalid or the page didn't load well
  if(document.getElementById('title').innerText==="") {
    alert("Cet article n'existe pas !");return;}
  // console.log("Added item ID: "+id);
  

  // Get the color value from the dropdown list
  const selectedColor = document.getElementById('colors');
  let color = selectedColor.options[selectedColor.selectedIndex].text;

  // Safety check if the color is not set
  if(color==="--SVP, choisissez une couleur --") {
    alert("La couleur n'est pas définie !");return;}
  // console.log("Added item color: "+color);


  // Get set quantity value as an integer
  let quantity = document.getElementById('quantity').value;
  
  // Safety check if the quantity is under 1
  if (quantity < 1) {
    alert("La quantité doit être supérieure à zéro !");return;}
  // console.log("Added item quantity: "+quantity);


  // Create a simplified object to symbolize the article
  let article = {id: id, color: color, quantity: quantity};
  //localStorage.removeItem('cart');
  
  // Create an empty cart if not already done
  if (localStorage.getItem('cart')===null) {
    // console.log("New cart created");
    let orderedItems = [];
    orderedItems.push(article);
    localStorage.setItem('cart', JSON.stringify(orderedItems));
  } else {


    // First check if the article is already in the cart ;
    // If it does, increment the quantity set in local storage
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
    

    //Else if the article is new, add it to the cart
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


document.getElementById('addToCart').addEventListener('click', addToCart);