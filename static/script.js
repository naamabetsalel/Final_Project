function myMenuFunction() {
    var i = document.getElementById("navMenu");

    if(i.className === "nav-menu"){
        i.className += " responsive";
    }else{ 
        i.className = "nav-menu";
    }
}

const activePage = window.location.href;
    const navLinks = document.querySelectorAll('ul li a.link');
    navLinks.forEach(element => {
        if (element.href==activePage) {
            element.classList.add('active');
        }
    });


    document.addEventListener("DOMContentLoaded", function () {
        // Get a reference to the input element
        const surgeryDateInput = document.getElementById("surgeryDate");
      
        // Create a JavaScript Date object for the current date
        const currentDate = new Date();
      
        // Format the current date to YYYY-MM-DD for the max attribute
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
      
        // Set the max attribute to the formatted current date
        surgeryDateInput.setAttribute("max", formattedDate);
      });

  

      
      fetch("/countExceed", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json()) // Parse the response as JSON
        .then(responseData => {
          const exceed = responseData.exceed;
          console.log("jkhkj");
        })
        .catch(err => {
          console.error('Error while extracting data hello', err);
          res.status(500).json({ error: 'Internal server error' });
        });