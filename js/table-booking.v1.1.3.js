const branches = [
  {bCode: 'MPBGCB', blName: 'TG Hyd - MPB Gachibowli', plusCode: 'C9JF+89 Hyderabad, Telangana', coordinates: [17.430958170950202, 78.37343172665412]},
  {bCode: 'MPBKDBSNL', blName: 'KA Blr - MPB Kadubeesanahalli', plusCode: 'WPQ2+V6 Bengaluru, Karnataka', coordinates: [12.939867733177106, 77.700833830908]}
];
const selectElement = document.getElementById('occation-type');
const otherOccasionInput = document.getElementById('other-occation-type-fileld');
selectElement.addEventListener('change', function () {
  if (selectElement.value === 'Others') {
    otherOccasionInput.style.display = 'block';
  } else {
    otherOccasionInput.style.display = 'none';
  }
});
function displayTodayDate() {
  var now = new Date();
  var today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  let bCode = document.getElementById('branch-location').value;

  var selectedDate = new Date(today);
  var selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });
  localStorage.setItem('selectedDay', JSON.stringify(selectedDay));

  var bookingDateEl = document.getElementById("booking-date");
  if (bookingDateEl) {
    bookingDateEl.value = today;
  }

  var maxDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  var formattedMaxDate = new Date(
    maxDate.getTime() - maxDate.getTimezoneOffset() * 60000
  ).toISOString().split('T')[0];

  if (bookingDateEl) {
    bookingDateEl.setAttribute('min', today);
    bookingDateEl.setAttribute('max', formattedMaxDate);
  }

  if(bCode) {
    specialDays();
    let vrucutoken = localStorage.getItem('vrucutoken');
    const requestBody = { bkFor: 'Booking', oCode: 'ONSSD', eCode: 'MPB', bCode: bCode };
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
          localStorage.setItem('blockedDatesList', JSON.stringify(rData.resData.result));
        } else {
          localStorage.setItem('blockedDatesList', JSON.stringify([]));
        }
      }).catch(error => { console.error(error); });
    }).catch(err => { console.error(err); });
  }
}
function dateChange() {
  var dateInput = document.getElementById('booking-date');
  var selectedDate = new Date(dateInput.value);
  var selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });
  localStorage.setItem('selectedDay', JSON.stringify(selectedDay));
}
function booktable() {
  let bDate = document.getElementById("booking-date").value;
  let bTime = document.getElementById("checkin-time").value;
  let dinnerbTime = document.getElementById("dinner-checkin-time").value;
  let cName = document.getElementById("contact-person").value;
  let occType = document.getElementById("occation-type").value;
  let otherOccType = document.getElementById("other-occation-type");
  let message = document.getElementById("booking-message").value;
  let errorMessage = document.getElementById('error-message');
  let blErrMsg = document.getElementById('branch-location-error-message');
  let bkngDiningType = document.getElementById('bkng-dining-text').textContent;
  let blockedDatesList = localStorage.getItem('blockedDatesList');
  let blckedDates = JSON.parse(blockedDatesList);
  let bCode = document.getElementById('branch-location').value;
  // let branchesData = document.getElementById('selected-branch');
  // let bList = localStorage.getItem('branches');
  // let branchesList = JSON.parse(bList);
  // let bData = bCode != '' ? branches.find(item => item.bCode == bCode) : {};

  document.getElementById("contact-person").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  document.getElementById("branch-location").addEventListener('change', function () {
    displayTodayDate();
    blErrMsg.textContent = "";
    blErrMsg.style.display = "none";
  });
  document.getElementById("booking-date").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  document.getElementById("checkin-time").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  // document.getElementById("selected-branch").addEventListener("input", function () {
  //   errorMessage.textContent = "";
  //   errorMessage.style.display = "none";
  // });
  document.getElementById("occation-type").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  document.getElementById("other-occation-type").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  let blockedDates = blckedDates && blckedDates.length > 0 && blckedDates.find(item => item.blckdDt === bDate && item.blckdSlotType === bkngDiningType && item.bCode == bCode);
  let blDates = blckedDates && blckedDates.length > 0 ? blckedDates.filter(item => item.blckdDt == bDate && item.bCode == bCode) : [];
  if (!cName) {
    errorMessage.textContent = "Name is required";
    errorMessage.style.display = "block";
  } else if(!bCode) {
    blErrMsg.textContent = "Branch - Location is required";
    blErrMsg.style.display = "block";
  } else if (!bDate) {
    errorMessage.textContent = "Date is required";
    errorMessage.style.display = "block";
  } else if (bDate < '2024-03-08') {
    errorMessage.textContent = "Sorry we are fully booked for the selected date, you can book for next day";
    errorMessage.style.display = "block";
  } else if (bDate && blDates && blDates.length > 0 && blDates.length == 2) {
    errorMessage.textContent = `Sorry we are fully booked for the selected date. Please choose different date.`;
    errorMessage.style.display = "block";
  } else if (bDate && blockedDates && blockedDates._id) {
    errorMessage.textContent = `Sorry we are fully booked for ${bkngDiningType} you can book for ${bkngDiningType == 'Lunch' ? 'Dinner' : 'Lunch'} or next day`;
    errorMessage.style.display = "block";
  } else if (!bTime) {
    errorMessage.textContent = "Time is required";
    errorMessage.style.display = "block";
  } else if (!occType) {
    errorMessage.textContent = "Occasion type is required";
    errorMessage.style.display = "block";
  } else if (occType == 'Others' && !otherOccType.value) {
    errorMessage.textContent = "Other Occasion is required";
    errorMessage.style.display = "block";
  } else {
    $(this).scrollTop(0);
    const selectElement = document.getElementById("branch-location");
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    const date = new Date(bDate);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);

    document.getElementById("branch-location-datetime").innerHTML = `<br /><div class='sisf-m-text'>
                  <p class='text-black'>Branch Location: <strong>${selectedText}</strong><br />
                  Reservation Date: <b>${formattedDate} ${bkngDiningType == 'Lunch' ? bTime : dinnerbTime}</b></p>
                </div>`
    document.getElementById("branch-location-datetime").style.display = "block";
    document.getElementById("mobile-number-field").style.display = "block";
    document.getElementById("booking-date-filed").style.display = "none";
    document.getElementById("checkin-time-filed").style.display = "none";
    document.getElementById("contact-person-fileld").style.display = "none";
    document.getElementById("occation-type-fileld").style.display = "none";
    document.getElementById("other-occation-type-fileld").style.display = "none";
    document.getElementById("booking-message-field").style.display = "none";
    document.getElementById("book-your-seat-field").style.display = "none";
    // document.getElementById("branch-filed").style.display = "none";
    document.getElementById('dining-types').style.display = "none";
    document.getElementById('lunch-checkin-time-field').style.display = "none";
    document.getElementById('dinner-checkin-time-field').style.display = "none";
  }
  const userDetails = { bDate, bTime: bkngDiningType == 'Lunch' ? bTime : dinnerbTime, cName, occType: occType == 'Others' ? otherOccType.value : occType, message, bkngDiningType };
  localStorage.setItem('userDetails', JSON.stringify(userDetails));
  return false
}
function sendotp() {
  let mobileNumber = document.getElementById("mobile-number").value;
  let mobileNumberError = document.getElementById("mobile-number-error");
  // let countryMobCode = document.getElementById("country-mob-code").value;
  let bCode = document.getElementById('branch-location').value;

  document.getElementById("mobile-number").addEventListener("input", function () {
    mobileNumberError.textContent = "";
    mobileNumberError.style.display = "none";
  });

  if (!mobileNumber) {
    mobileNumberError.textContent = "Mobile Number is required";
    mobileNumberError.style.display = "block";
  } else if (!/^\d{10}$/.test(mobileNumber)) {
    mobileNumberError.textContent = "Invalid mobile number";
    mobileNumberError.style.display = "block";
  } else {
    document.getElementById("send-otp-btn").disabled = true;
    let prevData = localStorage.getItem('userDetails');
    let data = JSON.parse(prevData);
    const mobData = { ...data, mobileNum: mobileNumber, userID: '+91' + mobileNumber }
    localStorage.setItem('userDetails', JSON.stringify(mobData))
    const requestBody = { name: data.cName, mobileNum: mobileNumber, userID: '+91' + mobileNumber, oCode: 'ONSSD', eCode: 'MPB', bCode: bCode };
    // fetch('http://localhost:3502/vru/cust/user/login/send/otp', {
    fetch('https://vrub2bapi.vreserveu.com/vrub2b/vru/cust/user/login/send/otp', {
      cache: 'no-cache',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }).then(response => {
      const otpToken = response.headers.get('vrucutoken');
      // const vrucutoken = response.headers.get('vrucutoken');
      response.json().then(rData => {
        if (rData.status == '200') {
          const otpElement = document.getElementById("otp-display");
          otpElement.style.display = "block";
          otpElement.textContent = "Please Enter OTP ";
          // verifyotp(rData.resData.otpNum, otpToken)
          const otpBlocks = document.getElementById("otp-blocks");
          otpBlocks.style.display = "block";
          const sendOtpButton = document.getElementById("send-otp-field");
          sendOtpButton.style.display = "none";
          const verifyOtpButton = document.getElementById("verify-otp-field");
          verifyOtpButton.style.display = "block";
          let timer = document.getElementById("timer");
          timer.style.display = "block";
          otpTimer();
          localStorage.setItem('otpToken', otpToken)
          document.getElementById("send-otp-btn").disabled = false;
          // document.getElementById("mobile-number").disabled = true;

          // const monileNumberField = document.getElementById("mobile-number-field");
          // monileNumberField.style.display = "none";
          // const reserveTableFields = document.getElementById("reserve-table-fields");
          // reserveTableFields.style.display = "block";
          // localStorage.setItem('vrucutoken', vrucutoken);
          // initialPrices(vrucutoken);
          // document.getElementById("verify-otp-btn").disabled = false;
        } else {
          document.getElementById("send-otp-btn").disabled = false;
          document.getElementById("mobile-number").disabled = false;
        }
      }).catch(error => { console.error(error); });
    }).catch(err => { console.error(err); });
  }
  return false
}
function otpBlocksData() {
  const otpInputs = [
    document.getElementById('exampleFormControlInput1'),
    document.getElementById('exampleFormControlInput2'),
    document.getElementById('exampleFormControlInput3'),
    document.getElementById('exampleFormControlInput4')
  ];

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
      if (index < otpInputs.length - 1 && event.target.value.length === 1) {
        otpInputs[index + 1].focus();
      } else if (index > 0 && event.target.value.length === 0) {
        otpInputs[index - 1].focus();
        otpInputs[index - 1].value = '';
      } else {
        verifyotp();
      }
      document.getElementById("verify-otp-btn").disabled = false;
      let errorMsg = document.getElementById("mobile-number-error");
      errorMsg.textContent = "";
      errorMsg.style.display = "none";
    });
    input.addEventListener('keydown', (event) => {
      if (event.key == 'Backspace' && index > 0 && event.target.value.length === 0) {
        otpInputs[index - 1].focus();
        otpInputs[index - 1].value = '';
        event.preventDefault();
      } else if (event.key != 'Backspace' && index < otpInputs.length - 1 && event.target.value.length === 1) {
        otpInputs[index + 1].focus();
      }
    })
  });
}
function otpTimer() {
  const timeRemainingElement = document.getElementById("time-remaining");
  timeRemainingElement.style.display = "block";
  const resendButton = document.getElementById("resend-button");
  resendButton.style.display = "block";
  let timer = document.getElementById("timer");
  timer.style.display = "block";

  let timerValue = true;
  let seconds = 0;
  let minutes = 0;

  // function updateTimeRemaining() {
  //   const resendButton = document.getElementById("resend-button");
  //   timeRemainingElement.textContent = `Time Remaining: ${`0${minutes}`}:${seconds < 10 ? `0${seconds}` : seconds}`;
  //   resendButton.disabled = seconds > 0 || (minutes > 0 && timerValue);
  // }
  function updateTimeRemaining() {
    const resendButton = document.getElementById("resend-button");
    timeRemainingElement.textContent = `Time Remaining: ${`0${minutes}`}:${seconds < 10 ? `0${seconds}` : seconds}`;
    if (seconds > 0 || (minutes > 0 && timerValue)) {
      // Disable link
      resendButton.style.pointerEvents = "none";
      resendButton.style.color = "gray";
      resendButton.style.cursor = "default";
    } else {
      // Enable link
      resendButton.style.pointerEvents = "auto";
      resendButton.style.color = "blue";  // Reset to default
      resendButton.style.cursor = "pointer";
    }
  }
  function resendOTP() {
    document.getElementById('resend-button').disabled = true;
    sendotp()
    let errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';
    document.getElementById('mobile-number-error').textContent = '';
  }
  document.getElementById("resend-button").addEventListener("click", resendOTP);

  const countdownInterval = setInterval(() => {
    if (seconds > 0 || minutes > 0 || timerValue) {
      if (seconds === 0) {
        seconds = 59;
      } else {
        seconds--;
        timerValue = false;
      }
      updateTimeRemaining();
    } else {
      clearInterval(countdownInterval);
    }
  }, 1000);
}

function verifyotp() {
  const otpNumber =
    document.getElementById("exampleFormControlInput1").value +
    document.getElementById("exampleFormControlInput2").value +
    document.getElementById("exampleFormControlInput3").value +
    document.getElementById("exampleFormControlInput4").value;

  const errorMsg = document.getElementById("mobile-number-error");
  const otpToken = localStorage.getItem('otpToken');
  const verifyBtn = document.getElementById("verify-otp-btn");
  let bCode = document.getElementById('branch-location').value;

  if (otpNumber.trim().length === 0) {
    errorMsg.textContent = "Please enter OTP";
    errorMsg.style.display = "block";
    return;
  }

  if (otpNumber.length !== 4) {
    errorMsg.textContent = "Please enter correct OTP";
    errorMsg.style.display = "block";
    return;
  }

  if (!otpToken) {
    errorMsg.textContent = "OTP expired. Please try again.";
    errorMsg.style.display = "block";
    return;
  }

  verifyBtn.disabled = true;
  errorMsg.style.display = "none";
  const requestBody = {
    otpNum: otpNumber,
    oCode: 'ONSSD',
    eCode: 'MPB',
    bCode: bCode
  };

  // fetch('http://localhost:3502/vru/cust/user/login/verify/otp', {
    fetch('https://vrub2bapi.vreserveu.com/vrub2b/vru/cust/user/login/verify/otp', {
    cache: 'no-cache',
    method: 'POST',
    headers: {
      'vrucutoken': otpToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => {
      const vrucutoken = response.headers.get('vrucutoken');
      return response.json().then(data => ({ data, vrucutoken }));
    })
    .then(({ data, vrucutoken }) => {
      if (data.status == '200') {
        document.getElementById("mobile-number-field").style.display = "none";
        document.getElementById("reserve-table-fields").style.display = "block";
        localStorage.setItem('vrucutoken', vrucutoken);
        localStorage.removeItem('otpToken');
        // initialPrices(vrucutoken);
        const sObj = JSON.parse(localStorage.getItem('specialDays') || '{}');
        sObj?._id ? setInitialPrices(sObj) : initialPrices(vrucutoken);
        document.getElementById("verify-otp-btn").disabled = false;
      } else if (data.status == '100') {
        errorMsg.textContent = "Invalid Otp";
        errorMsg.style.display = "block";
        document.getElementById("verify-otp-btn").disabled = true;
      } else if (data.status == '190') {
        errorMsg.textContent = "Otp expired please resend otp";
        errorMsg.style.display = "block";
        document.getElementById("verify-otp-btn").disabled = false;
      } else {
        document.getElementById("verify-otp-btn").disabled = false;
      }
    })
    .catch(() => {
      errorMsg.textContent = "Something went wrong. Try again.";
      errorMsg.style.display = "block";
    })
    .finally(() => {
      verifyBtn.disabled = false;
    });
  // }
}

function initialPrices(vrucutoken) {
  let bCode = document.getElementById('branch-location').value;
  // let branchesData = document.getElementById('selected-branch');
  // let bList = localStorage.getItem('branches');
  // let branchesList = JSON.parse(bList);
  // let bData = branchesList.find(item => item.bCode == branchesData.value);
  let dateInput = localStorage.getItem('selectedDay');
  let selectedDay = JSON.parse(dateInput);
  const payLoad = { oCode: 'ONSSD', eCode: 'MPB', bCode, day: selectedDay };
  // fetch('http://localhost:3502/vru/restaurant/info', {
    fetch('https://vrub2bapi.vreserveu.com/vrub2b/vru/restaurant/info', {
    cache: 'no-cache',
    method: 'POST',
    headers: {
      'vrucutoken': vrucutoken ? vrucutoken : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payLoad)
  }).then(response => {
    response.json().then(rData => {
      if (rData.status == '200') {
        localStorage.setItem('restaurantInfo', JSON.stringify(rData.resData.result));
        let vegPrice = rData.resData.result.vTotalAmt;
        let nonVegPrice = rData.resData.result.nvTotalAmt
        let childPrice = rData.resData.result.kTotalAmt;
        document.getElementById('main-veg-price').textContent = '₹' + vegPrice;
        document.getElementById('main-non-veg-price').textContent = '₹' + nonVegPrice;
        document.getElementById('main-child-price').textContent = '₹' + childPrice;
      } else {
        localStorage.removeItem('restaurantInfo');
      }
    }).catch(error => { console.error(error); });
  }).catch(err => { console.error(err); });
}
function setInitialPrices(sObj) {
  let bDate = document.getElementById("booking-date") ? document.getElementById("booking-date").value : '';
  let dateInput = localStorage.getItem('selectedDay');
  let selectedDay = dateInput ? JSON.parse(dateInput) : '';
  let vegPrice = (selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? sObj?.wevTotalAmt : sObj?.wvTotalAmt);
  let nonVegPrice = (selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? sObj?.wenvTotalAmt : sObj?.wnvTotalAmt);
  let childPrice = (selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? sObj?.wekTotalAmt : sObj?.wkTotalAmt);
  document.getElementById('main-veg-price').textContent = (bDate == '2024-12-25' || bDate == '2024-01-01') ? '₹1049' : '₹' + vegPrice;
  document.getElementById('main-non-veg-price').textContent = (bDate == '2024-12-25' || bDate == '2024-01-01') ? '₹1149' : '₹' + nonVegPrice;
  document.getElementById('main-child-price').textContent = (bDate == '2024-12-25' || bDate == '2024-01-01') ? '₹524' : '₹' + childPrice;
}
function handleVegQty(type) {
  let priceData = localStorage.getItem('restaurantInfo');
  let rInfo = JSON.parse(priceData);
  let sData = localStorage.getItem('specialDays');
  let sInfo = JSON.parse(sData);
  let quantityInput = document.getElementById('veg-quantity');
  let currentQuantity = parseInt(quantityInput.value);
  let dateInput = document.getElementById('booking-date');
  let selectedDate = new Date(dateInput.value);
  let selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });
  let vegPrice = sInfo?._id ? (selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? sInfo.wevTotalAmt : sInfo.wvTotalAmt) : rInfo?._id ? rInfo.vTotalAmt : '';
  let rtableErrorMsg = document.getElementById('rTable-error-msg');
  if (type === 'veg-dec') {
    if (currentQuantity >= 1) {
      quantityInput.value = currentQuantity - 1;
      currentQuantity == 1 ? vegPrice = 0 : vegPrice = vegPrice * currentQuantity - vegPrice;
      rtableErrorMsg.textContent = ""
    } else {
      quantityInput.value = 0;
      vegPrice = 0;
      rtableErrorMsg.textContent = ""
    }
    removeOffer();
  } else {
    quantityInput.value = currentQuantity + 1;
    vegPrice = vegPrice + vegPrice * currentQuantity;
    rtableErrorMsg.textContent = ""
    removeOffer();
  }
  document.getElementById('veg-total-price').textContent = vegPrice == 0 ? '' : '₹' + vegPrice;
  updateTotalPrice();
}
function handleNonVegQty(type) {
  let priceData = localStorage.getItem('restaurantInfo');
  let rInfo = JSON.parse(priceData);
  let sData = localStorage.getItem('specialDays');
  let sInfo = JSON.parse(sData);
  let quantityInput = document.getElementById('non-veg-quantity');
  let currentQuantity = parseInt(quantityInput.value);
  let dateInput = document.getElementById('booking-date');
  let selectedDate = new Date(dateInput.value);
  let selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });
  let nonVegPrice = sInfo?._id ? (selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? sInfo.wenvTotalAmt : sInfo.wenvTotalAmt) : rInfo?._id ? rInfo.nvTotalAmt : '';
  let rtableErrorMsg = document.getElementById('rTable-error-msg');

  if (type === 'non-veg-dec') {
    if (currentQuantity >= 1) {
      quantityInput.value = currentQuantity - 1;
      currentQuantity == 1 ? nonVegPrice = 0 : nonVegPrice = nonVegPrice * currentQuantity - nonVegPrice;
      rtableErrorMsg.textContent = ""
    } else {
      quantityInput.value = 0;
      nonVegPrice = 0;
      rtableErrorMsg.textContent = ""
    }
    removeOffer();
  } else {
    quantityInput.value = currentQuantity + 1;
    nonVegPrice = nonVegPrice + nonVegPrice * currentQuantity;
    rtableErrorMsg.textContent = ""
    removeOffer();
  }
  document.getElementById('non-veg-total-price').textContent = nonVegPrice == 0 ? '' : '₹' + nonVegPrice;
  updateTotalPrice();
}
function handleChildQty(type) {
  let priceData = localStorage.getItem('restaurantInfo');
  let rInfo = JSON.parse(priceData);
  let sData = localStorage.getItem('specialDays');
  let sInfo = JSON.parse(sData);
  var quantityInput = document.getElementById('child-quantity');
  var currentQuantity = parseInt(quantityInput.value);
  let dateInput = document.getElementById('booking-date');
  let selectedDate = new Date(dateInput.value);
  let selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });

  let childPrice =  sInfo?._id ? (selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? sInfo.wekTotalAmt : sInfo.wkTotalAmt) : rInfo?._id ? rInfo.kTotalAmt : '';
  var rtableErrorMsg = document.getElementById('rTable-error-msg');

  if (type === 'child-dec') {
    if (currentQuantity >= 1) {
      quantityInput.value = currentQuantity - 1;
      currentQuantity == 1 ? childPrice = 0 : childPrice = childPrice * currentQuantity - childPrice;
      rtableErrorMsg.textContent = ""
    } else {
      quantityInput.value = 0;
      childPrice = 0;
      rtableErrorMsg.textContent = ""
    }
    removeOffer();
  } else {
    quantityInput.value = currentQuantity + 1;
    childPrice = childPrice + childPrice * currentQuantity;
    rtableErrorMsg.textContent = ""
    removeOffer();
  }
  document.getElementById('child-total-price').textContent = childPrice == 0 ? '' : '₹' + childPrice;
  updateTotalPrice();
}
function updateTotalPrice() {
  let vegPrice = parseInt(document.getElementById('veg-total-price').textContent.replace('₹', ''));
  let nonVegPrice = parseInt(document.getElementById('non-veg-total-price').textContent.replace('₹', ''));
  let childPrice = parseInt(document.getElementById('child-total-price').textContent.replace('₹', ''));
  let offerAmount = document.getElementById("offerAmount");
  let offeredAmount1 = document.getElementById("offeredAmount").textContent.replace('₹', '');
  let offeredAmount = offeredAmount1 && offeredAmount1.slice(1, offeredAmount1.length);
  let totalNetAmount = document.getElementById("totalNetAmount");
  let appliedOffer = document.getElementById('applied-offer');
  let appliedCoupon = document.getElementById("apply-coupon");
  let totalPrice = (vegPrice ? vegPrice : 0) + (nonVegPrice ? nonVegPrice : 0) + (childPrice ? childPrice : 0);
  document.getElementById('total').textContent = totalPrice == 0 ? '' : '₹' + totalPrice;
  document.getElementById('netAmount').textContent = totalPrice === 0 ? '' : offeredAmount !== '' ? "₹" + (totalPrice - offeredAmount) : '';
  document.getElementById('offeredAmount').textContent = totalPrice === 0 ? '' : offeredAmount !== '' ? "-" + "₹" + offeredAmount : '';
  totalPrice == 0 ? offerAmount.style.display = 'none' : offeredAmount !== '' ? offerAmount.style.display = 'block' : offerAmount.style.display = 'none';
  totalPrice === 0 ? totalNetAmount.style.display = 'none' : offeredAmount !== '' ? offerAmount.style.display = 'block' : offerAmount.style.display = 'none';
  totalPrice === 0 ? appliedOffer.style.display = 'none' : offeredAmount !== '' ? appliedOffer.style.display = 'block' : appliedOffer.style.display = 'none';
  totalPrice === 0 ? appliedCoupon.style.display = 'none' : offeredAmount !== '' ? appliedCoupon.style.display = 'none' : appliedCoupon.style.display = 'block';
}
function reservetable() {
  let vegQty = parseInt(document.getElementById("veg-quantity").value) || 0;
  let mainVegAmount = parseInt(document.getElementById('main-veg-price').textContent.replace('₹', '')) || 0;

  let nonVegQty = parseInt(document.getElementById("non-veg-quantity").value) || 0;
  let mainNonVegAmount = parseInt(document.getElementById('main-non-veg-price').textContent.replace('₹', '')) || 0;

  let childQty = parseInt(document.getElementById("child-quantity").value) || 0;
  let mainChildAmount = parseInt(document.getElementById('main-child-price').textContent.replace('₹', '')) || 0;

  let rtableErrorMsg = document.getElementById("rTable-error-msg");
  let reserveTableField = document.getElementById("reserve-table-fields");
  let bkngConfirmField = document.getElementById("booking-confirm-field");
  let bbLoc = document.getElementById("bkng-branch-location");
  const selectBlElement = document.getElementById("branch-location");
  const bLocText = selectBlElement.options[selectBlElement.selectedIndex].text;
  let bookingId = document.getElementById("booking-id");
  let bookingDate = document.getElementById("bkng-date");

  let totalAmount = parseInt(document.getElementById('total').textContent.replace('₹', '')) || 0;
  let totalNetAmount = parseInt(document.getElementById('netAmount').textContent.replace('₹', '')) || 0;

  let vrucutoken = localStorage.getItem('vrucutoken');
  let appliedOffer = localStorage.getItem('appliedOffer');
  let selectedOffer = appliedOffer ? JSON.parse(appliedOffer) : null;

  let bCode = document.getElementById('branch-location').value;
  let bData = branches.find(item => item.bCode == bCode);

  let pda = selectedOffer && selectedOffer.dp
    ? Math.round((selectedOffer.dp / 100) * totalAmount)
    : 0;

  let pdAmount = selectedOffer && selectedOffer.amount
    ? (selectedOffer.amount > 0 && pda > selectedOffer.amount ? selectedOffer.amount : pda)
    : pda;

  let dAmount = pdAmount
    ? pdAmount
    : (selectedOffer && selectedOffer.amount > 0 && selectedOffer.dp === 0 && selectedOffer.amount <= totalAmount
      ? selectedOffer.amount
      : 0);

  if (vegQty === 0 && nonVegQty === 0) {
    rtableErrorMsg.textContent = 'Please select atleast one Veg or Non Veg';
    rtableErrorMsg.style.display = "block";
    return false;
  }

  rtableErrorMsg.style.display = "none";
  document.getElementById("reserve-table-btn").disabled = true;

  let prevData = localStorage.getItem('userDetails');
  let data = prevData ? JSON.parse(prevData) : {};

  const date = new Date(data.bDate);
  const formatedDate =
    date.toISOString().split("T")[0] + " " + date.toTimeString().slice(0, 8);

  const requestBody = {
    name: data.cName,
    mobileNum: data.mobileNum,
    oType: data.occType,
    userID: data.userID,

    vegCount: vegQty,
    vegAmt: mainVegAmount,

    nonVegCount: nonVegQty,
    nonVegAmt: mainNonVegAmount,

    kidsCount: childQty,
    kidsAmt: mainChildAmount,

    netAmt: totalNetAmount || totalAmount,
    netTotalAmt: totalNetAmount || totalAmount,
    totalAmt: totalAmount,

    actNetAmt: totalNetAmount || totalAmount,
    actTotalNetAmt: totalNetAmount || totalAmount,
    actTotalAmt: totalAmount,

    bDtTm: new Date(data.bDate),
    bDt: data.bDate,
    bTm: data.bTime,
    bDtStr: formatedDate,

    bookInfo: data.message || '',
    offer: selectedOffer && selectedOffer._id ? selectedOffer._id : '',
    coupon: selectedOffer && selectedOffer.coupon ? selectedOffer.coupon : '',
    dp: selectedOffer && selectedOffer.dp ? selectedOffer.dp : 0,
    dAmount: dAmount,

    bookType: 'Website',
    blName: bData?.blName || "TG Hyd - MPB Gachibowli",
    plusCode: { plusCode: bData?.plusCode || 'C9JF+89 Hyderabad, Telangana' },
    geocoordinates: {
      type: 'Point',
      coordinates: bData?.coordinates?.length ? bData.coordinates : [17.430958170950202, 78.37343172665412]
    },

    rFor: data.bkngDiningType,
    oCode: 'ONSSD',
    eCode: 'MPB',
    bCode: bCode
  };
    // fetch('http://localhost:3502/vru/cust/table/booking/create', {
    fetch('https://vrub2bapi.vreserveu.com/vrub2b/vru/cust/table/booking/create', {
    cache: 'no-cache',
    method: 'POST',
    headers: {
      'vrucutoken': vrucutoken || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(rData => {
      if (rData.status === '200') {
        const date = new Date(rData.resData.result.bDt);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);

        reserveTableField.style.display = 'none';
        bkngConfirmField.style.display = 'block';

        bbLoc.textContent = "Branch Location: " + bLocText;
        bookingId.textContent = "Booking ID: " + rData.resData.result.bookingId;
        bookingDate.textContent =
          "Reserved Date: " + formattedDate + "  " + rData.resData.result.bTm;

        localStorage.setItem('userInfo', JSON.stringify(rData.resData.result));
        localStorage.removeItem('specialDays')
      } else {
        alert('Your Booking Failed');
      }
      document.getElementById("reserve-table-btn").disabled = false;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("reserve-table-btn").disabled = false;
    });

  return false;
}

function applyCoupon() {
  let vrucutoken = localStorage.getItem('vrucutoken');
  let total = document.getElementById('total');
  // let branchesData = document.getElementById('selected-branch');
  // let bList = localStorage.getItem('branches');
  // let branchesList = JSON.parse(bList);
  // let bData = branchesList.find(item => item.bCode == branchesData.value);
  let bCode = document.getElementById('branch-location').value;
  const payLoad = {
    oCode: 'ONSSD',
    eCode: 'MPB',
    bCode: bCode
  };
  $('#coupon-model').modal('show');

  // fetch('http://localhost:3502/vru/cust/offers/list', {
    fetch('https://vrub2bapi.vreserveu.com/vrub2b/vru/cust/offers/list', {
    cache: 'no-cache',
    method: 'POST',
    headers: {
      'vrucutoken': vrucutoken ? vrucutoken : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payLoad)
  }).then(response => {
    response.json().then(rData => {
      if (rData.status == '200') {
        const offers = rData.resData.result.find(item => item.bCode === bCode);
        localStorage.setItem('offers', JSON.stringify(offers));
        offersData(offers, total)
      }
    }).catch(error => { console.error(error); });
  }).catch(err => { console.error(err); });
}

function offersData(couponsData, total) {
  let appliedOffer = document.getElementById('applied-offer');
  let offerName = document.getElementById("offer-name");
  let offerSavings = document.getElementById("offer-savings");
  let appliedCoupon = document.getElementById("apply-coupon");
  let modalBody = document.querySelector('.coupon.modal-body');
  let offerRemoveButton = document.getElementById("offer-remove-button");
  let offerAmount = document.getElementById("offerAmount");
  let offeredAmount = document.getElementById("offeredAmount");
  let totalNetAmount = document.getElementById("totalNetAmount");
  let totalAmount1 = document.getElementById("netAmount");
  let totalAmount = parseInt(document.getElementById('total').textContent.replace('₹', ''));
  let quantityVegInput = document.getElementById('veg-quantity');
  let currentVegQuantity = parseInt(quantityVegInput.value);
  let quantityNonVegInput = document.getElementById('non-veg-quantity');
  let currentQuantity = parseInt(quantityNonVegInput.value);
  var quantitychildInput = document.getElementById('child-quantity');
  var currentChildQuantity = parseInt(quantitychildInput.value);

  let dateInput = document.getElementById('booking-date');
  let selectedDate = new Date(dateInput.value);
  let selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });

  modalBody.innerHTML = '';
  couponsData.forEach(offer => {
    let tQty = currentVegQuantity + currentQuantity + currentChildQuantity
    let couponCard = document.createElement('div');
    couponCard.classList.add('coupon', 'card', 'mt-3');
    if (totalAmount >= offer.minbValue && tQty >= offer.minMem) {
      couponCard.style.pointerEvents = '';
      couponCard.style.opacity = '';
    } else {
      // couponCard.style.pointerEvents = 'none';
      // couponCard.style.opacity = '0.5';
    }

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    let couponHeader = document.createElement('div');
    couponHeader.classList.add('d-flex', 'justify-content-between');

    let couponInfo = document.createElement('div');

    let couponCode = document.createElement('h3');
    couponCode.classList.add('coupon-code');
    couponCode.textContent = offer.coupon;

    let couponDescription = document.createElement('h6');
    couponDescription.classList.add('text-success');
    couponDescription.textContent = `${offer.title}`;

    couponInfo.appendChild(couponCode);
    couponInfo.appendChild(couponDescription);

    couponHeader.appendChild(couponInfo);

    let couponApply = document.createElement('div');
    couponApply.classList.add('coupon-apply');
    couponApply.textContent = 'APPLY';
    // let appliedCoupons = {};
    couponApply.addEventListener('click', () => {
      // appliedCoupons = offer;
      if (offer.coupon !== 'FLAT20P' || (offer.coupon === 'FLAT20P' && (selectedDay == 'Monday' || selectedDay == 'Saturday'))) {
        localStorage.setItem('appliedOffer', JSON.stringify(offer));
        // let modal = document.querySelector('.modal');
        // modal.style.display = 'none';
        appliedCoupon.style.display = "none";
        appliedOffer.style.display = 'block';
        offerAmount.style.display = 'none';
        totalNetAmount.style.display = 'none';
        offerName.textContent = `'${offer.coupon}'` + ' applied';
        offerSavings.textContent = `${offer.title}`; // "₹" + offer.amount + " coupon savings";
        offerRemoveButton.textContent = '';
        if (offer.amount > 0 && offer.dp == 0 && (offer.amount <= totalAmount)) {
          let data = ((totalAmount) - (offer.amount));
          total.textContent = "₹" + totalAmount;
          offeredAmount.textContent = "-" + "₹" + offer.amount;
          totalAmount1.textContent = "₹" + data;
        } else if (offer.amount == 0 && offer.dp > 0) {
          let result = Math.round((offer.dp / 100) * totalAmount);
          let data = ((totalAmount) - (result));
          // offerSavings.textContent = "₹" + result + " coupon savings";
          total.textContent = "₹" + totalAmount;
          offeredAmount.textContent = "-" + "₹" + result;
          totalAmount1.textContent = "₹" + data;
        } else if (offer.amount > 0 && offer.dp > 0) {
          let dAmt = Math.round((offer.dp / 100) * totalAmount);
          let discAmt = dAmt <= offer.amount ? dAmt : offer.amount;
          let data = ((totalAmount) - (discAmt));
          // offerSavings.textContent = "₹" + discAmt + " coupon savings";
          total.textContent = "₹" + totalAmount;
          offeredAmount.textContent = "-" + "₹" + discAmt;
          totalAmount1.textContent = "₹" + data;
        }
        $('#coupon-model').modal('hide');
      } else {
        alert('Sorry, "' + offer.coupon + '" coupon code is not applicable. Choose applicable coupon code');
      }
    });

    couponHeader.appendChild(couponApply);
    cardBody.appendChild(couponHeader);

    let dottedHr = document.createElement('hr');
    dottedHr.classList.add('dotted');
    cardBody.appendChild(dottedHr);

    let couponTextContent = document.createElement('div');
    couponTextContent.classList.add('coupon-text-content');
    couponTextContent.textContent = offer.desc;

    cardBody.appendChild(couponTextContent);

    couponCard.appendChild(cardBody);

    modalBody.appendChild(couponCard);
  });
}

function removeOffer() {
  let offerAmount = document.getElementById("offerAmount");
  let totalNetAmount = document.getElementById("totalNetAmount");
  let appliedOffer = document.getElementById('applied-offer');
  let appliedCoupon = document.getElementById("apply-coupon");
  let modal = document.querySelector('.modal');
  modal.style.display = 'none';
  offerAmount.style.display = 'none';
  totalNetAmount.style.display = 'none';
  appliedOffer.style.display = 'none';
  appliedCoupon.style.display = 'block';
  document.getElementById("offeredAmount").textContent = '';
  document.getElementById("netAmount").textContent = '';
  document.getElementById("offer-name").textContent = '';
  document.getElementById("offer-savings").textContent = '';
  $('#coupon-model').modal('hide');
}
function selecteBkngdDining(type) {
  let selectedDining = document.getElementById('bkng-dining-text');
  let selectedDiningLunch = document.getElementById('bkng-dining-lunch');
  let selectedDiningDinner = document.getElementById('bkng-dining-dinner');
  let lunchCheckinTimeField = document.getElementById('lunch-checkin-time-field');
  let dinnerCheckinTimeField = document.getElementById('dinner-checkin-time-field');
  let lunchCheckinTime = document.getElementById('checkin-time');
  let dinnerCheckinTime = document.getElementById('dinner-checkin-time');
  let errorMessage = document.getElementById('error-message');
  if (type == 'Lunch') {
    selectedDiningLunch.classList.add('selected');
    selectedDiningDinner.classList.remove('selected');
    lunchCheckinTimeField.style.display = 'block';
    dinnerCheckinTimeField.style.display = 'none';
    lunchCheckinTime.value = "12:00 PM";
    errorMessage.textContent = ''
  } else {
    selectedDiningDinner.classList.add('selected');
    selectedDiningLunch.classList.remove('selected');
    lunchCheckinTimeField.style.display = 'none';
    dinnerCheckinTimeField.style.display = 'block';
    dinnerCheckinTime.value = "07:00 PM"
    errorMessage.textContent = ''
  }
  selectedDining.textContent = type;
}
function specialDays(date) {
  const bookingDate = document.getElementById('booking-date');
  if (!bookingDate) return;
  callSpecialDaysAPI(bookingDate.value);
  bookingDate.addEventListener('change', () => {
    callSpecialDaysAPI(bookingDate.value);

  });
}
function callSpecialDaysAPI(date) {
  const selectedDate = new Date(date);
  const selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });
  localStorage.setItem('selectedDay', JSON.stringify(selectedDay));
  let bCode = document.getElementById('branch-location').value;

  const vrucutoken = localStorage.getItem('vrucutoken');
  const body = { oCode: "ONSSD", eCode: "MPB", bCode: bCode };

  // fetch('http://localhost:3502/vru/cust/spcl/day/pricings/list', {
  fetch('https://vrub2bapi.vreserveu.com/vrub2b/vru/cust/spcl/day/pricings/list', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'vrucutoken': vrucutoken || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json()).then(rData => {
    if (rData.status == '200') {
      const rd = rData.resData?.result;
      const dd = rd.find(item => {
        const startDate = new Date(item.sdStDt.split('T')[0]);
        const endDate = new Date(item.sdEtDt.split('T')[0]);
        return selectedDate >= startDate && selectedDate <= endDate;
      }) || {}; 
      localStorage.setItem('specialDays', JSON.stringify(dd || {}));
    } else {
      localStorage.removeItem('specialDays');
    }
  }).catch(console.error);
}
