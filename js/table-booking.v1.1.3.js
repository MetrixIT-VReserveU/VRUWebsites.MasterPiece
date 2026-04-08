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
  var today = new Date().toISOString().split('T')[0];
  var tomorrow = new Date();
  tomorrow.setDate(new Date().getDate());
  const date = tomorrow.toISOString().split('T')[0];
  var selectedDay = tomorrow.toLocaleString('en-US', { weekday: 'long' });
  localStorage.setItem('selectedDay', JSON.stringify(selectedDay));

  document.getElementById("booking-date").value = date;
  var maxDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  var formattedMaxDate = maxDate.toISOString().split('T')[0];
  document.getElementById('booking-date').setAttribute('min', today);
  document.getElementById('booking-date').setAttribute('max', formattedMaxDate);
  let bbqhatoken = localStorage.getItem('bbqhatoken');
  let bid = 'MPBGCB';
  const requestBody = {bkFor: 'Booking'}

  // fetch(`http://localhost:3001/bbqh/custs/table/blckd/dates/list/${bid}`, {
  fetch(`https://bbqh.skillworksit.com/custs/bbqh/custs/table/blckd/dates/list/${bid}`, {
    cachce: false,
    method: 'POST',
    headers: {
      'bbqhatoken': bbqhatoken ? bbqhatoken : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  }).then(response => {
    response.json().then(rData => {
      if (rData.status == '200') {
        localStorage.setItem('blockedDatesList', JSON.stringify(rData.resData.result));
      } else{
        localStorage.setItem('blockedDatesList',JSON.stringify([]));
      }
    }).catch(error => { });
  }).catch(err => { });
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
  let bkngDiningType = document.getElementById('bkng-dining-text').textContent;
  let blockedDatesList = localStorage.getItem('blockedDatesList');
  let blckedDates = JSON.parse(blockedDatesList);
  // let branchesData = document.getElementById('selected-branch');
  // let bList = localStorage.getItem('branches');
  // let branchesList = JSON.parse(bList);
  // let bData = branchesData.value != '' ? branchesList.find(item => item.bCode == branchesData.value) : {};

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
  document.getElementById("contact-person").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  document.getElementById("occation-type").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  document.getElementById("other-occation-type").addEventListener("input", function () {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });
  let blockedDates = blckedDates && blckedDates.length > 0 && blckedDates.find(item => item.blckdDt === bDate && item.blckdSlotType === bkngDiningType && item.bCode == 'MPBGCB');
  let blDates = blckedDates && blckedDates.length > 0 ? blckedDates.filter(item => item.blckdDt == bDate && item.bCode == 'MPBGCB') : [];
  if (!bDate) {
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
  } else if (!cName) {
    errorMessage.textContent = "Name is required";
    errorMessage.style.display = "block";
  } else if (!occType) {
    errorMessage.textContent = "Occation type is required";
    errorMessage.style.display = "block";
  } else if (occType == 'Others' && !otherOccType.value) {
    errorMessage.textContent = "Other Occation is required";
    errorMessage.style.display = "block";
  } else {
    $(this).scrollTop(0);
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
    const requestBody = { name: data.cName, mobileNum: mobileNumber, userID: '+91' + mobileNumber, bCode: 'MPBGCB' };
    // fetch('http://localhost:3001/bbqh/cust/user/login/send/otp', {
    fetch('https://bbqh.skillworksit.com/custs/bbqh/cust/user/login/send/otp', {
      cachce: false,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }).then(response => {
      const otpToken = response.headers.get('bbqhotoken');
      const bbqhatoken = response.headers.get('bbqhatoken');
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
          // localStorage.setItem('bbqhatoken', bbqhatoken);
          // initialPrices(bbqhatoken);
          // document.getElementById("verify-otp-btn").disabled = false;
        } else {
          document.getElementById("send-otp-btn").disabled = false;
          document.getElementById("mobile-number").disabled = false;
        }
      }).catch(error => { });
    }).catch(err => { });
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
  const otpNumber = document.getElementById("exampleFormControlInput1").value +
    document.getElementById("exampleFormControlInput2").value +
    document.getElementById("exampleFormControlInput3").value +
    document.getElementById("exampleFormControlInput4").value;
  let errorMsg = document.getElementById("mobile-number-error");
  const otpToken = localStorage.getItem('otpToken');
  if (!otpNumber) {
    errorMsg.textContent = "Please Enter Otp";
    errorMsg.style.display = "block";
  } else if (otpNumber && otpNumber.length != 4) {
    errorMsg.textContent = "Please Enter Correct Otp";
    errorMsg.style.display = "block";
  } else {
    document.getElementById("verify-otp-btn").disabled = true;
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
    const requestBody = { otpNum: otpNumber };
    // fetch('http://localhost:3001/bbqh/cust/user/login/verify/otp', {
    fetch('https://bbqh.skillworksit.com/custs/bbqh/cust/user/login/verify/otp', {
      cachce: false,
      method: 'POST',
      headers: {
        'bbqhotoken': otpToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }).then(response => {
      const bbqhatoken = response.headers.get('bbqhatoken');
      response.json().then(rData => {
        if (rData.status == '200') {
          const monileNumberField = document.getElementById("mobile-number-field");
          monileNumberField.style.display = "none";
          const reserveTableFields = document.getElementById("reserve-table-fields");
          reserveTableFields.style.display = "block";
          localStorage.setItem('bbqhatoken', bbqhatoken);
          initialPrices(bbqhatoken);
          localStorage.removeItem('otpToken');
          document.getElementById("verify-otp-btn").disabled = false;
        } else if (rData.status == '100') {
          errorMsg.textContent = "Invalid Otp";
          errorMsg.style.display = "block";
          document.getElementById("verify-otp-btn").disabled = true;
        } else if (rData.status == '190') {
          errorMsg.textContent = "Otp expired please resend otp";
          errorMsg.style.display = "block";
          document.getElementById("verify-otp-btn").disabled = false;
        } else {
          document.getElementById("verify-otp-btn").disabled = false;
        }
      }).catch(error => { });
    }).catch(err => { });
  }
}

function initialPrices(bbqhatoken) {
  // let branchesData = document.getElementById('selected-branch');
  // let bList = localStorage.getItem('branches');
  // let branchesList = JSON.parse(bList);
  // let bData = branchesList.find(item => item.bCode == branchesData.value);
  const payLoad = { id: 'BBQHABRID100003' }
  // fetch('http://localhost:3001/bbqh/restaurant/info', {
  fetch('https://bbqh.skillworksit.com/custs/bbqh/restaurant/info', {
    cachce: false,
    method: 'POST',
    headers: {
      'bbqhatoken': bbqhatoken ? bbqhatoken : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payLoad)
  }).then(response => {
    response.json().then(rData => {
      if (rData.status == '200') {
        let dateInput = localStorage.getItem('selectedDay');
        let selectedDay = JSON.parse(dateInput);
        let uDetails = localStorage.getItem('userDetails');
        let ud = JSON.parse(uDetails);
        // const data = ((ud.bDate == '2024-12-25' && ud.bkngDiningType == 'Lunch') || (ud.bDate == '2024-12-24' && ud.bkngDiningType == 'Dinner')) ? {...rData.resData.result, 'wevTotalAmt': 1599, 'wvTotalAmt': 1599, 'weVegAmt': 1599, 'wenvTotalAmt': 1599, 'wnvTotalAmt': 1599, 'weNonVegAmt': 1599, 'wekTotalAmt': 699, 'wkTotalAmt': 699, 'weKidAmt': 699} : (((ud.bDate == '2025-01-01' && ud.bkngDiningType == 'Lunch') || (ud.bDate == '2024-12-31' && ud.bkngDiningType == 'Dinner')) ? {...rData.resData.result, 'wevTotalAmt': 2025, 'wvTotalAmt': 2025, 'weVegAmt': 2025, 'wenvTotalAmt': 2025, 'wnvTotalAmt': 2025, 'weNonVegAmt': 2025, 'wekTotalAmt': 699, 'wkTotalAmt': 699, 'weKidAmt': 699} : rData.resData.result);
        const data = (selectedDay === 'Sunday' && ud.bkngDiningType == 'Lunch') ? {...rData.resData.result, 'wevTotalAmt': 1499, 'weVegAmt': 1499, 'wenvTotalAmt': 1599, 'weNonVegAmt': 1599, 'wekTotalAmt': 699, 'weKidAmt': 699} : rData.resData.result;
        localStorage.setItem('restaurantInfo', JSON.stringify(data));
        let vegPrice = selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? data.wevTotalAmt : data.wvTotalAmt;
        let nonVegPrice = selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? data.wenvTotalAmt : data.wnvTotalAmt;
        let childPrice = selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? data.wekTotalAmt : data.wkTotalAmt;
        document.getElementById('main-veg-price').textContent = '₹' + vegPrice;
        document.getElementById('main-non-veg-price').textContent = '₹' + nonVegPrice;
        document.getElementById('main-child-price').textContent = '₹' + childPrice;
      }
    }).catch(error => { });
  }).catch(err => { });
}
function handleVegQty(type) {
  let priceData = localStorage.getItem('restaurantInfo');
  let restaurantInfo = JSON.parse(priceData);
  let quantityInput = document.getElementById('veg-quantity');
  let currentQuantity = parseInt(quantityInput.value);
  let dateInput = document.getElementById('booking-date');
  let selectedDate = new Date(dateInput.value);
  let selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });
  let vegPrice = selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday' ? restaurantInfo.wevTotalAmt : restaurantInfo.wvTotalAmt;
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
  let restaurantInfo = JSON.parse(priceData);
  let quantityInput = document.getElementById('non-veg-quantity');
  let currentQuantity = parseInt(quantityInput.value);
  let dateInput = document.getElementById('booking-date');
  let selectedDate = new Date(dateInput.value);
  let selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });

  let nonVegPrice = (selectedDay === 'Friday' || selectedDay === 'Saturday' || selectedDay === 'Sunday') ? restaurantInfo.wenvTotalAmt : restaurantInfo.wnvTotalAmt;
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
  let restaurantInfo = JSON.parse(priceData);
  var quantityInput = document.getElementById('child-quantity');
  var currentQuantity = parseInt(quantityInput.value);
  var childPrice = restaurantInfo.wkTotalAmt;
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
  // appliedCoupon.style.display = 'none';
}
function reservetable() {
  let vegQty = parseInt(document.getElementById("veg-quantity").value);
  let mainVegAmount = parseInt(document.getElementById('main-veg-price').textContent.replace('₹', ''));
  let nonVegQty = parseInt(document.getElementById("non-veg-quantity").value);
  let mainNonVegAmount = parseInt(document.getElementById('main-non-veg-price').textContent.replace('₹', ''));
  let childQty = parseInt(document.getElementById("child-quantity").value);
  let mainChildAmount = parseInt(document.getElementById('main-child-price').textContent.replace('₹', ''));
  let rtableErrorMsg = document.getElementById("rTable-error-msg");
  let reserveTableField = document.getElementById("reserve-table-fields");
  let bkngConfirmField = document.getElementById("booking-confirm-field");
  let bookingId = document.getElementById("booking-id");
  let bookingDate = document.getElementById("bkng-date");
  let totalAmount = parseInt(document.getElementById('total').textContent.replace('₹', ''));
  let totalNetAmount = parseInt(document.getElementById('netAmount').textContent.replace('₹', ''));
  let bbqhatoken = localStorage.getItem('bbqhatoken');
  let appliedOffer = localStorage.getItem('appliedOffer');
  let selectedOffer = JSON.parse(appliedOffer);
  // let branchesData = document.getElementById('selected-branch');
  // let bList = localStorage.getItem('branches');
  // let branchesList = JSON.parse(bList);
  let pda = selectedOffer && selectedOffer.dp ? Math.round((selectedOffer.dp / 100) * totalAmount) : 0;
  let pdAmount = selectedOffer && selectedOffer.amount ? (selectedOffer.amount > 0 && pda > selectedOffer.amount ? selectedOffer.amount : pda) : pda;
  let dAmount = pdAmount ? pdAmount : ((selectedOffer && selectedOffer.amount > 0 && selectedOffer.dp === 0 && (selectedOffer.amount <= totalAmount)) ? selectedOffer.amount : 0);

  // let bData = branchesList.find(item => item.bCode == branchesData.value);

  if (vegQty == 0 && nonVegQty == 0) {
    rtableErrorMsg.textContent = 'Please select atleast one Veg or Non Veg';
    rtableErrorMsg.style.display = "block";
  } else {
    document.getElementById("reserve-table-btn").disabled = true;
    let prevData = localStorage.getItem('userDetails');
    let data = JSON.parse(prevData);
    const date = new Date(data.bDate);
    const formatedDate = date.toISOString().split("T")[0] + " " + date.toTimeString().slice(0, 8);
    const requestBody = {
      name: data.cName,
      mobileNum: data.mobileNum,
      oType: data.occType,
      userID: data.userID,
      vegCount: vegQty ? vegQty : 0,
      vegAmt: mainVegAmount ? mainVegAmount : 0,
      nonVegCount: nonVegQty ? nonVegQty : 0,
      nonVegAmt: mainNonVegAmount ? mainNonVegAmount : 0,
      kidsCount: childQty ? childQty : 0,
      kidsAmt: mainChildAmount ? mainChildAmount : 0,
      netAmt: totalNetAmount ? totalNetAmount : totalAmount,
      totalAmt: totalAmount,
      actNetAmt: totalNetAmount ? totalNetAmount : totalAmount,
      actTotalAmt: totalAmount,
      bDtTm: new Date(data.bDate),
      bDt: data.bDate,
      bTm: data.bTime,
      bDtStr: formatedDate,
      bookInfo: data.message ? data.message : '',
      offer: selectedOffer && selectedOffer._id ? selectedOffer._id : '',
      coupon: selectedOffer && selectedOffer.coupon ? selectedOffer.coupon : '',
      dp: selectedOffer && selectedOffer.dp ? selectedOffer.dp : 0,
      dAmount: dAmount,
      branch: 'BBQHABRID100003',
      bCode: 'MPBGCB',
      bookType: 'Website',
      blName : "TG Hyd - MPB Gachibowli",
      plusCode: {plusCode: 'C9JF+89 Hyderabad, Telangana'},
      geocoordinates: {
        type: 'Point',
        coordinates: [17.430958170950202, 78.37343172665412]
      },
      rFor: data.bkngDiningType
    };

    // fetch('http://localhost:3001/bbqh/cust/table/booking/create', {
    fetch('https://bbqh.skillworksit.com/custs/bbqh/cust/table/booking/create', {
      cachce: false,
      method: 'POST',
      headers: {
        'bbqhatoken': bbqhatoken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }).then(response => {
      response.json().then(rData => {
        if (rData.status == '200') {
          const date = new Date(rData.resData.result.bDt);
          const options = { day: '2-digit', month: 'short', year: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-GB', options);
          reserveTableField.style.display = 'none';
          bkngConfirmField.style.display = 'block';
          bookingId.textContent = "Booking ID: " + rData.resData.result.bookingId;
          bookingDate.textContent = "Reserved Date: " + formattedDate + "  " + rData.resData.result.bTm;
          localStorage.setItem('userInfo', JSON.stringify(rData.resData.result))
          document.getElementById("reserve-table-btn").disabled = false;
        } else {
          document.getElementById("reserve-table-btn").disabled = false;
          alert('Your Booking Failed');
        }
      }).catch(error => { });
    }).catch(err => { });
  }
  return false
}
function applyCoupon() {
  let bbqhatoken = localStorage.getItem('bbqhatoken');
  let total = document.getElementById('total');
  // let branchesData = document.getElementById('selected-branch');
  // let bList = localStorage.getItem('branches');
  // let branchesList = JSON.parse(bList);
  // let bData = branchesList.find(item => item.bCode == branchesData.value);
  const payLoad = { branch: 'BBQHABRID100003' };
  $('#coupon-model').modal('show');

  // fetch('http://localhost:3001/bbqh/cust/offers/list', {
  fetch('https://bbqh.skillworksit.com/custs/bbqh/cust/offers/list', {
    cachce: false,
    method: 'POST',
    headers: {
      'bbqhatoken': bbqhatoken ? bbqhatoken : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payLoad)
  }).then(response => {
    response.json().then(rData => {
      if (rData.status == '200') {
        localStorage.setItem('offers', JSON.stringify(rData.resData.result));
        offersData(rData.resData.result, total)
      }
    }).catch(error => { });
  }).catch(err => { });
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
      if(offer.coupon !== 'FLAT20P' || (offer.coupon === 'FLAT20P' && (selectedDay == 'Monday' || selectedDay == 'Saturday'))) {
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