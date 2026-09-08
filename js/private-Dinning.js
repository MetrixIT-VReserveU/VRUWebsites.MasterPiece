function displayTodayDate() {
  var today = new Date().toISOString().split('T')[0];

  document.getElementById("date-pick").value = today;
  var maxDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  var formattedMaxDate = maxDate.toISOString().split('T')[0];
  document.getElementById('date-pick').setAttribute('min', today);
  document.getElementById('date-pick').setAttribute('max', formattedMaxDate);
}
function selectedDining(type) {
  let selectedDining = document.getElementById('private-dining-text');
  let selectedDiningLunch = document.getElementById('private-dining-lunch');
  let selectedDiningDinner = document.getElementById('private-dining-dinner');
  let errorMessage = document.getElementById('prvt-dining-errorMsg');
  let pHoursTime = document.getElementById('private-dining-hours');
  let pMinsTime = document.getElementById('private-dining-minutes');
  let pTime = document.getElementById('private-dining-time');

  if (type == 'Lunch') {
    selectedDiningLunch.classList.add('selected');
    selectedDiningDinner.classList.remove('selected');
    errorMessage.textContent = ''
    pHoursTime.value = '01';
    pMinsTime.value = '00';
    pTime.value = 'PM';
  } else {
    selectedDiningDinner.classList.add('selected');
    selectedDiningLunch.classList.remove('selected');
    errorMessage.textContent = '';
    pHoursTime.value = '07';
    pMinsTime.value = '00';
    pTime.value = 'PM'
  }
  selectedDining.textContent = type;
}

function privateDiningSubmit() {
  let pName = document.getElementById('name').value;
  let pMobileNumber = document.getElementById('mobileNumber').value;
  let email = document.getElementById('email').value;
  let selectedDining = document.getElementById('private-dining-text').textContent;
  let errorMessage = document.getElementById('prvt-dining-errorMsg');
  let Occation = document.getElementById('occation').value;
  let pDate = document.getElementById('date-pick').value;
  let tdCount = document.getElementById('tDiners').value;
  let nvCount = document.getElementById('nvDiners').value;
  let vCount = document.getElementById('vDiners').value;
  let kCount = document.getElementById('kDiners').value;
  let pDiningMsg = document.getElementById('message').value;
  let pHoursTime = document.getElementById('private-dining-hours').value;
  let pMinsTime = document.getElementById('private-dining-minutes').value;
  let pTime = document.getElementById('private-dining-time').value;
  let bkngConfirmField = document.getElementById("pd-booking-confirm-field");
  let privateDiningForm = document.getElementById("private-dining-form");
  let bookingId = document.getElementById("pd-booking-id");
  let bookingDate = document.getElementById("pd-bkng-date");
  let blockedDatesList = localStorage.getItem('pdblockedDatesList');
  let blckedDates = JSON.parse(blockedDatesList);
  document.getElementById("name").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });

  document.getElementById("mobileNumber").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });

  document.getElementById("tDiners").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  document.getElementById("nvDiners").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  document.getElementById("vDiners").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  document.getElementById("kDiners").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  document.getElementById("private-dining-time").addEventListener("input", function () {
    Event.preventDefault();
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });

  document.getElementById("occation").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });

  document.getElementById("date-pick").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });


  document.getElementById("message").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });

  document.getElementById("name").addEventListener("onchange", function () {
    pName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  });
  let blockedDates = blckedDates && blckedDates.length > 0 ? blckedDates.find(item => item.blckdDt == pDate && item.blckdSlotType == selectedDining && item.bCode == 'MPBGCB'):{};
  let blDates = blckedDates ? blckedDates.length > 0 && blckedDates.filter(item => item.blckdDt == pDate && item.bCode == 'MPBGCB') : [];
  let tc = parseInt(tdCount) ? parseInt(tdCount) : 0;
  let nc = parseInt(nvCount) ? parseInt(nvCount) : 0;
  let vc = parseInt(vCount) ? parseInt(vCount) : 0;
  let kc = parseInt(kCount) ? parseInt(kCount) : 0;
  const ac = nc + vc + kc;    
  if (!pName) {
    errorMessage.textContent = "Name is required";
    errorMessage.style.display = "block";
  } else if (!pMobileNumber) {
    errorMessage.textContent = "Mobile Number is required";
    errorMessage.style.display = "block";
  } else if (!selectedDining) {
    errorMessage.textContent = "Please Select Lunch or Dinner";
    errorMessage.style.display = "block";
  } else if(!Occation){
    errorMessage.textContent = "Occation Type is required";
    errorMessage.style.display = "block";
  } else if(!pDate){
    errorMessage.textContent = "Date is required";
    errorMessage.style.display = "block";
  } else if (pDate && blDates && blDates.length > 0 && blDates.length == 2) {
    errorMessage.textContent = `Sorry we are fully booked for the selected date. Please choose different date.`;
    errorMessage.style.display = "block";
  } else if (pDate && blockedDates && blockedDates._id) {
    errorMessage.textContent = `Sorry we are fully booked for ${selectedDining} you can book for ${selectedDining == 'Lunch' ? 'Dinner' : 'Lunch'}`;
    errorMessage.style.display = "block";
  } else if(pDate <= '2024-03-10'){
    errorMessage.textContent = "Sorry we are fully booked for the selected date, you can book for next day";
    errorMessage.style.display = "block";
  } else if (tc == 0) {
    errorMessage.textContent = "Total Diners is required";
    errorMessage.style.display = "block";
  } else if (tc !== 0 && (tc !== ac)) {
    errorMessage.textContent = "Veg, Non-Veg and Kids count should be equal to Total Diners";
    errorMessage.style.display = "block";
  } else if (!pDiningMsg) {
    errorMessage.textContent = "Message is required";
    errorMessage.style.display = "block";
  } else {
    document.getElementById("prvt-dining-btn").disabled = true;

    const date = new Date(pDate);
    const formatedDate = date.toISOString().split("T")[0] + " " + date.toTimeString().slice(0, 8);
    const reqBody = {
      name: pName,
      mobileNum: pMobileNumber,
      emID: email,  
      bookingFor: selectedDining,
      oType: Occation,
      bDt: pDate,
      bTm: pHoursTime + ':' + pMinsTime + ' ' + pTime,
      bookInfo: pDiningMsg,
      bDtStr: formatedDate,
      bDtTm: new Date(pDate),
      userID: '+91' + pMobileNumber,
      brLocation: "TG Hyd - MPB Gachibowli",
      plusCode: "+91",
      geocoordinates: {
        type: 'Point',
        coordinates: [17.465390065251178, 78.36823869624536]
      },
      tDinersCount: tc || 0,
      nonVegCount: nc || 0,
      vegCount: vc || 0,
      kidsCount: kc || 0,
      oCode: 'ONSSD',
      eCode: 'MPB',
      bCode: 'MPBGCB',
    }

    // fetch('http://localhost:3502/vru/cust/private/dining/create', {
    fetch('https://vrub2bapi.vreserveu.com/vrub2b/vru/cust/private/dining/create', {
      cache: 'no-cache',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody)
    }).then(response => {
      response.json().then(rData => {
        if (rData.status == '200') {
          const date = new Date(rData.resData.result.bDt);
          const options = { day: '2-digit', month: 'short', year: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-GB', options);
          privateDiningForm.style.display = 'none';
          bkngConfirmField.style.display = 'block';
          bookingId.textContent = "Booking ID: " + rData.resData.result.bookingId;
          bookingDate.textContent = "Reserved Date: " + formattedDate + "  " + rData.resData.result.bTm;
          document.getElementById("prvt-dining-btn").disabled = false;
        } else {
          document.getElementById("prvt-dining-btn").disabled = false;
        }
      }).catch(error => { });
    }).catch(err => { });
  }
  return false;
}
function displayPdDate() {
  let vrucutoken = localStorage.getItem('vrucutoken');
  const requestBody = {bkFor: 'Private Dining', oCode: 'ONSSD', eCode: 'MPB', bCode: 'MPBGCB'}
  // fetch(`http://localhost:3502/vru/custs/table/blckd/dates/list`, {
  fetch(`https://vrub2bapi.vreserveu.com/vrub2b/vru/custs/table/blckd/dates/list`, {
    cache: 'no-cache',
    method: 'POST',
    headers: {
      'vrucutoken': vrucutoken ? vrucutoken : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  }).then(response => {
    response.json().then(rData => {
      if (rData.status == '200') {
        localStorage.setItem('pdblockedDatesList', JSON.stringify(rData.resData.result));
      } else{
        localStorage.setItem('pdblockedDatesList', JSON.stringify([]));  
      }
    }).catch(error => { console.error(error); });
  }).catch(err => { console.error(err); });
}
