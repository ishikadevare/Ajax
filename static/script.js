document.addEventListener("DOMContentLoaded", function () {
    // Get references to the HTML elements we'll need
    const registrationForm = document.getElementById("registration-form");
    const registrationStatus = document.getElementById("registration-status");
  
    // Function to handle form submission
    function submitForm(event) {
      event.preventDefault(); // Prevent the default form submission behavior
  
      // Get the form data
      const name = document.getElementById("name").value;
      const college = document.getElementById("college").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
  
      // Validate the form data
      if (!name) {
        registrationStatus.innerHTML = "Name field is required";
        return;
      }
      if (!college) {
        registrationStatus.innerHTML = "College field is required";
        return;
      }
      if (!username) {
        registrationStatus.innerHTML = "Username field is required";
        return;
      }
      if (password !== confirmPassword) {
        registrationStatus.innerHTML = "Passwords do not match";
        return;
      }
  
      // Make an AJAX request to check if the username already exists
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/check-username");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.exists) {
            registrationStatus.innerHTML = "Username already exists";
          } else {
            // Make another AJAX request to submit the form data to the backend
            const xhr2 = new XMLHttpRequest();
            xhr2.open("POST", "/register");
            xhr2.setRequestHeader("Content-Type", "application/json");
            xhr2.onload = function () {
              if (xhr2.status === 200) {
                registrationStatus.innerHTML = "Successfully registered";
              } else {
                registrationStatus.innerHTML = "Error registering";
              }
            };
            xhr2.send(JSON.stringify({
              name: name,
              college: college,
              username: username,
              password: password
            }));
          }
        } else {
          registrationStatus.innerHTML = "Error checking username";
        }
      };
      xhr.send(JSON.stringify({
        username: username
      }));
    }
  
    // Attach the submitForm function to the form's submit event
    registrationForm.addEventListener("submit", submitForm);
  });
  