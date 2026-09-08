function contactUs() {
    let name = document.getElementById('name').value;
    let mobileNum = document.getElementById('mobileNumber').value;
    // let countryMobCode = document.getElementById('country-mob-code').value;
    let email = document.getElementById('email').value;
    let notes = document.getElementById('message').value;
    let errorMessage = document.getElementById('errorMessage');
    let vrucutoken = localStorage.getItem('vrucutoken');
  
    document.getElementById("name").addEventListener("input", function () {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    });
    document.getElementById("mobileNumber").addEventListener("input", function () {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    });
    document.getElementById("email").addEventListener("input", function () {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    });
    document.getElementById("message").addEventListener("input", function () {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    });
  
    if (!name) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Name is required';
    } else if (!mobileNum) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Mobile Number is required';
    } else if (!email) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Email is required';
    } else if (!notes) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Message is required';
    } else {
      const reqBody = {
        oCode: 'ONSSD',
        eCode: 'MPB',
        bCode: 'MPBGCB',
        name,
        mobileNum,
        userID: mobileNum,
        emID: email,
        message: notes,
      };
      // fetch('http://localhost:3502/vru/cust/contact/create', {
      fetch('https://vrub2bapi.vreserveu.com/vrub2b/vru/cust/contact/create', {
        cache: 'no-cache',
        method: 'POST',
        headers: {
          'vrucutoken': vrucutoken ? vrucutoken : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody)
      }).then(response => {
        response.json().then(rData => {
          if (rData.status == '200') {
            document.getElementById('contact-form').style.display = 'none';
            document.getElementById('contactus-success-container').style.display = 'block';
            document.getElementById('contactus-success-msg').textContent = 'Thank you for Contacting Us. We will get back you soon';
            document.getElementById("contact-us-btn").disabled = false;
          } else {
            document.getElementById("contact-us-btn").disabled = false;
          }
        }).catch(error => { console.error(error); });
      }).catch(err => { console.error(err); });
  
    }
    return false;
  }
