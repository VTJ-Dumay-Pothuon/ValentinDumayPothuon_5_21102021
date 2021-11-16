// Total quantity and total price of the cart are set as global variables
let totalQuantity = 0;
   let totalPrice = 0;

// Once these variable are set in the async fetch, they are displayed
function updateTotal (inCart, item) {
  totalQuantity += parseInt(inCart.quantity);
     totalPrice += parseInt(inCart.quantity) * parseInt(item.price);
  document.getElementById('totalQuantity').innerText = totalQuantity;
     document.getElementById('totalPrice').innerText = totalPrice;
  // console.log (inCart);
}

// Whether it's incremented, decremented or the article is deleted,
// the article's quantity must be first substracted from the total
function removeFromTotal (inCart, item) {
  totalQuantity -= parseInt(inCart.quantity);
     totalPrice -= parseInt(inCart.quantity) * parseInt(item.price);
}


// Each article entry added to the cart is displayed thanks to this massive chunk of html
// #item is the article entry in the API catalogue, that contains the global settings
// #ordered is the article entry in the local storage, that contains the quantity and set color
function newArticle (item, ordered) {
  let cartItems = document.getElementById('cart__items') ;
  let article = document.createElement("ARTICLE");
  article.setAttribute("class", "cart__item");
  article.setAttribute("data-id", ordered.id);
  article.setAttribute("data-color", ordered.color)
  cartItems.appendChild(article);

  article.innerHTML = '<div class="cart__item__img">'
                    +'<img src="'+item.imageUrl
                    +'" alt="Photographie d’un canapé'+item.altTxt
                    +'"></div><div class="cart__item__content">'
                    +'<div class="cart__item__content__titlePrice">'
                    +'<h2>'      +item.name+' — '     +ordered.color
                    +'</h2><p>'  +item.price              ////
                    +' €</p></div><div class="cart__item__content__settings">'
                    +'<div class="cart__item__content__settings__quantity">'
                    +'<p>Qté : </p><input id="quantity-'+ordered.id+'-'+ordered.color+'" type="number" class="itemQuantity"'
                    +' name="itemQuantity" min="1" max="100" value="'+ordered.quantity
                    +'"></div><div class="cart__item__content__settings__delete">'
                    +'<p class="deleteItem" id="delete-'+ordered.id+'-'+ordered.color+'">Supprimer</p>'
                    +'</div></div></div>';
}


// Returns the article quantity base on the article id and color
function getQuantity (inCart) {
  // console.log(inCart);
  return document.getElementById('quantity-'+inCart.id+'-'+inCart.color);
}


// Regex patterns used for the form entries. In short:
//– Name pattern allows for most latin character, hyphen, and space
//– Address pattern allows for the full name pattern, plus digits
//– Mail Pattern's username allows for address pattern -space  +underscore
//––– Full mail pattern MUST be addressPattern@lowercase-or-digits.lowercase
const namePattern = new RegExp ( "^[A-Za-zÀ-ÖØ-öø-ſ\\-\\ ]+$" )    ;
const addressPattern = new RegExp("^[0-9"+namePattern.source.slice(2));
const emailPattern = new RegExp( addressPattern.source.substring (   //
  0, addressPattern.source.length - 5)+"\\.\\_]+@[0-9a-z\\-]+\\.[a-z]+$");

// Default error message for Form invalid entries. 'false' means erase.
function errorMessage (field, display=true,
// If you want to customize displayMessage, you must add 'true' before.
displayMessage="Un ou plus plusieurs caractères invalides !") {
  if (display) {
    document.getElementById(field+"ErrorMsg").innerText = displayMessage;
  } else {
    document.getElementById(field+"ErrorMsg").innerText = "";
  }
}

// Array of objects that associates a form field, a RegEx pattern, and a validation boolean
let fields = [{id: "firstName", pattern: namePattern,    valid: false},
              {id: "lastName",  pattern: namePattern,    valid: false},
              {id: "address",   pattern: addressPattern, valid: false},
              {id: "city",      pattern: namePattern,    valid: false},
              {id: "email",     pattern: emailPattern,   valid: false}];

// Add an event listener to each form field with specific RegEx patterns to check on
function setFields () {
  for (let field of fields) {
    document.getElementById(field.id).addEventListener("input", function(e) {
      if (field.pattern.test(e.target.value)) {
        errorMessage(field.id,false);
        field.valid = true;
        // console.log (field.id+" : "+field.valid);
      } else {
        if (field.id==="email") {
          errorMessage(field.id,true,"Ceci n'est pas une adresse email valide !");
        } else {
          errorMessage(field.id);
        }
        field.valid = false;
      }
    });
  }
  // Return true only if ALL fields are valid
  let formValidation = fields[0].valid;
  for (const field of fields) {
    formValidation = formValidation && field.valid;
  }
  return formValidation;
}

// Check if all fields are valid and the cart isn't empty
function setOrderButton(cart) {
  let validForm = false;
  document.getElementById('order').addEventListener('click', function(e) {
    e.preventDefault();
    validForm = setFields() && cart.length>0;
    if (validForm) {
      sendOrder(cart);
    } else {
      if (!cart || cart.length<1) {
        alert("Le panier est vide !");
      } else {
        alert("Le formulaire est invalide !");
      }
    }
  });
}


// Add an event listener to the deleted button so that articles can be deleted
function setDeletionButton (cart, inCart, item) {
  // console.log(cart); console.log(inCart); console.log(item);
  let article = document.querySelectorAll(
    '[data-id="'+inCart.id+'"][data-color="'+inCart.color+'"]')[0];
  let deleteArticle = document.getElementById('delete-'+inCart.id+'-'+inCart.color);
  deleteArticle.addEventListener('click', function() {
    removeFromTotal(inCart, item);
    inCart.quantity = "0";
    cart.splice(cart.indexOf(inCart), 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    article.remove();
    updateTotal(inCart, item);
  });
}


// Build up a contact object containing the fields' informations
function setContact () {
  let contact={firstName:"",lastName:"",address:"",city:"",email:""};
  contact.firstName = document.getElementById('firstName').value;
   contact.lastName = document.getElementById('lastName').value;
    contact.address = document.getElementById('address').value;
       contact.city = document.getElementById('city').value;
      contact.email = document.getElementById('email').value;
  return contact;
}


// Build up an array of product-IDs from what's in the cart
function setProducts (cart) {
  let products = [];
  for (let inCart of cart) {
    products.push(inCart.id);
  }
  return products;
}


function sendOrder(cart) {
  const contact = setContact();
  const products = setProducts(cart);
  fetch("http://localhost:3000/api/products/order", {
     
    // Adding method type
    method: "POST",
     
    // Adding body or contents to send
    body: JSON.stringify({
        contact: contact,
        products: products
    }),
     
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
  })
  
  .then(function (response) {
    //console.log(response.json());
    return response.json();
  })
  .catch(function (error) {
      console.log(error);
    })

  .then(function (order) {
    // console.log(order.orderId);
    window.location.href = './confirmation.html?orderId='+order.orderId;
  })
} 

// This pseudo-function allows to load a different code whether the page
// is cart.html or product.html, as the html pages import the same file;
//-------------------------------------------
// It doesn't matter if "orderId" passed through the URL is valid or not,
// as confirmation.html is a read-only user notic. No "hack" is possible
if (document.URL.indexOf("confirmation.html") >= 0) {
  // Get the id parameter from URL
  const queryString = window.location.search;
  // console.log(queryString);
  const id = new URLSearchParams(queryString).get('orderId');
  // console.log(id);
  document.getElementById('orderId').innerText = id;
} else {


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
    // console.log(cart);
    for (let inCart of cart) {
      for (let item of data) {
        // console.log(item);

        // Check if inCart article is valid and is the currently parsed item
        // Here the color doesn't matter. Just checking for API data to show
        if (inCart.id===item._id) {
          // console.log("— "+inCart.quantity+" "+item.name+" "+inCart.color);
          
          newArticle (item, inCart);
          updateTotal(inCart, item);

          // For each individual article-color pair, an event listener is put onto the quantity
          // On change, it updates the quantity in local storage, and reloads the total values
          let checkQuantity = getQuantity(inCart);
          checkQuantity.addEventListener('change', function() {
            // console.log(inCart);

            //## First, temporarily remove the updated article from total ##
            removeFromTotal(inCart, item);

            //## Second, update the quantity set in local storage ##
            inCart.quantity = checkQuantity.value;
            localStorage.setItem('cart', JSON.stringify(cart));
            // console.log(cart);
            // console.log("— "+inCart.quantity+" "+item.name+" "+inCart.color);

            //## Third, re-add it to total, with the new quantity ##
            updateTotal(inCart, item);
          });

          // Setup deletion button for each article
          setDeletionButton (cart, inCart, item);

          // Stop searching the article, 
          // as it's already found
          break;
        }
      }
    }
    
    // Setup order form fields' validation
    setFields();

    // Setup order button for the whole cart
    setOrderButton(cart);
  })
}