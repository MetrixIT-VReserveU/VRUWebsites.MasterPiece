function setRating(ratingType, rating) {
  const stars = document.querySelectorAll(`#${ratingType} i`);
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.remove("far");
      star.classList.add("fas");
    } else {
      star.classList.remove("fas");
      star.classList.add("far");
    }
  });
  document.getElementById(`${ratingType}`).value = rating;
}
function setFoodRating(rating) {
  setRating("food-rating", rating);
}
function setServiceRating(rating) {
  setRating("service-rating", rating);
}
function setAmbienceRating(rating) {
  setRating("ambience-rating", rating);
}
function setOverallRating(rating) {
  let feedbackErrorMsg = document.getElementById("feedback-errorMsg");
  const stars = document.querySelectorAll("#overall-rating i");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.remove("far");
      star.classList.add("fas");
      document.getElementById("overall-rating").value = rating;
      feedbackErrorMsg.textContent = "";
      feedbackErrorMsg.style.display = "none";
    } else {
      star.classList.remove("fas");
      star.classList.add("far");
      document.getElementById("overall-rating").value = rating;
      feedbackErrorMsg.textContent = "";
      feedbackErrorMsg.style.display = "none";
    }
  });
}
function submitFeedback() {
  let overallRating = document.getElementById("overall-rating").value;
  let foodRating = document.getElementById("food-rating").value;
  let serviceRating = document.getElementById("service-rating").value;
  let ambienceRating = document.getElementById("ambience-rating").value;

  let feedback = document.getElementById("feedback-msg").value;
  let dob = document.getElementById("date-of-birth").value;
  let name = document.getElementById("name").value;
  let mobileNumber = document.getElementById("mobileNumber").value;
  let mobCountryCode = document.getElementById("country-mob-code").value;
  let feedBackSuccess = document.getElementById("feedback-success");
  let feedBackForm = document.getElementById("feedback-form");
  let feedbackSuccMsg = document.getElementById("feedback-success-msg");
  let googleReviewMsg = document.getElementById("google-review-msg");
  let loadingContainer = document.getElementById('loading-container');

  let vrucutoken = localStorage.getItem('vrucutoken')

  let feedbackErrorMsg = document.getElementById("feedback-errorMsg");

  document.getElementById("name").addEventListener("input", function () {
    feedbackErrorMsg.textContent = "";
    feedbackErrorMsg.style.display = "none";
  });
  document.getElementById("mobileNumber").addEventListener("input", function () {
    feedbackErrorMsg.textContent = "";
    feedbackErrorMsg.style.display = "none";
  });
  if (!overallRating) {
    feedbackErrorMsg.textContent = "Please Select Overall Rating";
    feedbackErrorMsg.style.display = "block";
  } else if (!name) {
    feedbackErrorMsg.textContent = "Please Enter Your Name";
    feedbackErrorMsg.style.display = "block";
  } else if (!mobileNumber) {
    feedbackErrorMsg.textContent = "Please Enter Your MobileNumber";
    feedbackErrorMsg.style.display = "block";
  } else {
    document.getElementById("fb-create-btn").disabled = true;
    const dobDate = dob ? new Date(dob) : '';
    const formatedDobDate = dobDate ? dobDate.toISOString().split("T")[0] + " " + dobDate.toTimeString().slice(0, 8) : '';
    const reqBody = {
      rating: overallRating ? Number(overallRating) : 0,
      fRating: foodRating ? Number(foodRating) : 0,
      sRating: serviceRating ? Number(serviceRating) : 0,
      aRating: ambienceRating ? Number(ambienceRating) : 0,
      feedback: feedback ? feedback : '',
      dob: dob ? dob : '',
      dobStr: formatedDobDate ? formatedDobDate : '',
      name: name,
      mobileNum: mobileNumber,
      userID: mobCountryCode + mobileNumber,
      oCode: 'ONSSD',
      eCode: 'MPB',
      bCode: 'MPBGCB',
    }
    // fetch('http://localhost:3502/vru/cust/user/feedback/create', {
    fetch('https://vrub2bapi.vreserveu.com/vrub2b/vru/cust/user/feedback/create', {
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
          feedBackSuccess.style.display = "block";
          feedbackSuccMsg.textContent = "Thank you for your feedback";
          feedBackForm.style.display = "none";
          if (overallRating >= 4) {
            googleReviewMsg.innerHTML = `Please rate in google <i class="fab fa-google"></i>`;
            loadingContainer.style.display = 'block';
            googleReviewMsg.addEventListener("click", function (event) {
              event.preventDefault();
              window.open("https://g.page/r/CZjuF-ZtK37VEBM/review", "_blank");
            })
            setTimeout(function () {
              window.open("https://g.page/r/CZjuF-ZtK37VEBM/review", "_blank");
              loadingContainer.style.display = 'none';
            }, 3000);
          }
          document.getElementById("fb-create-btn").disabled = false;
        }else{
          document.getElementById("fb-create-btn").disabled = false;
        }
      }).catch(error => { console.error(error); });
    }).catch(err => { console.error(err); });
  }
  return false
}
