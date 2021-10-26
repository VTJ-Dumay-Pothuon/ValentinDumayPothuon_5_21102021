// Get the id parameter from URL
const queryString = window.location.search;
 console.log(queryString);
const id = new URLSearchParams(queryString).get('id');
 console.log(id);


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
        console.log(item);
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
