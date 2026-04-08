// Format helper functions
function initCaps(val) {
  return val.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}
function onlyLowercase(val) {
  return val.replace(/\s/g, '').toLowerCase();
}
function onlyDigits(val) {
  return val.replace(/[^\d]/g, '');
}
const dateInput = document.getElementById('date');
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const yyyy = tomorrow.getFullYear();
const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
const dd = String(tomorrow.getDate()).padStart(2, '0');
const minDate = `${yyyy}-${mm}-${dd}`;

dateInput.min = minDate;
function clearError(id) {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = '';
    el.style.display = 'none';
  }
}
function clearFailMsg() {
  const failMsg = document.getElementById('fail-errMsg');
  if (failMsg) {
    failMsg.style.display = 'none';
    failMsg.innerText = '';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('mobNum');
  const guests = document.getElementById('numOfPersons');
  const srvcFor = document.getElementById('srvcFor');
  const date = document.getElementById('date');
  const location = document.getElementById('location');
  const occ = document.getElementById('occ');

  fullName.addEventListener('input', () => {
    fullName.value = initCaps(fullName.value);
    clearError('err-fullName');
    clearFailMsg();
  });
  phone.addEventListener('input', () => {
    phone.value = onlyDigits(phone.value);
    clearError('err-phone');
    clearFailMsg();
  });
  guests.addEventListener('input', () => {
    guests.value = onlyDigits(guests.value);
    clearError('err-guests');
    clearFailMsg();
  });
  srvcFor.addEventListener('input', () => {
    clearError('err-srvcFor');
    clearFailMsg();
  });
  occ.addEventListener('change', () => {
    if (occ.value === 'Other') {
      document.getElementById('otherOccDiv').style.display = 'block'
    }
    clearError('err-occ');
    clearFailMsg();
  });
  date.addEventListener('input', () => {
    clearError('err-date');
    clearFailMsg();
  });

  location.addEventListener('input', () => {
    location.value = initCaps(location.value);
    clearError('err-location');
    clearFailMsg();
  });
  guests.addEventListener('input', () => clearError('err-guests'));
  date.addEventListener('input', () => clearError('err-date'));
  location.addEventListener('input', () => clearError('err-location'));
});

function reservation() {
  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('mobNum');
  const guests = document.getElementById('numOfPersons');
  const srvcFor = document.getElementById('srvcFor');
  const date = document.getElementById('date');
  const location = document.getElementById('location');
  const occ = document.getElementById('occ');
  const otherOcc = document.getElementById('otherOcc');
  const comment = document.getElementById('comment');
  const catForm = document.getElementById('catering-form');
  const catConfirm = document.getElementById('catering-confirm-field');
  const catBtn = document.getElementById('prvt-dining-btn');
  const failMsg = document.getElementById('fail-errMsg');

  const fNameErr = document.getElementById('err-fullName');
  const phoneErr = document.getElementById('err-phone');
  const guestErr = document.getElementById('err-guests');
  const srvcForErr = document.getElementById('err-srvcFor');
  const dateErr = document.getElementById('err-date');
  const locationErr = document.getElementById('err-location');
  const otherOccErr = document.getElementById('err-otherOcc');

  // Reset errors
  document.querySelectorAll('.error-msg').forEach(el => {
    el.innerText = '';
    el.style.display = 'none';
  });

  let isValid = true;

  if (fullName.value.trim() === '') {
    fNameErr.innerText = 'Name is required';
    fNameErr.style.display = 'block';
    isValid = false;
  }

  if (phone.value.trim() === '') {
    phoneErr.innerText = 'Phone Number is required';
    phoneErr.style.display = 'block';
    isValid = false;
  } else if (!/^\d{10}$/.test(phone.value.trim())) {
    phoneErr.innerText = 'Enter valid 10-digit phone';
    phoneErr.style.display = 'block';
    isValid = false;
  }

  if (guests.value.trim() === '') {
    guestErr.innerText = 'Number of persons is required';
    guestErr.style.display = 'block';
    isValid = false;
  }

  if (srvcFor.value.trim() === '') {
    srvcForErr.innerText = 'Service For is required';
    srvcForErr.style.display = 'block';
    isValid = false;
  }

  if (date.value.trim() === '') {
    dateErr.innerText = 'Date is required';
    dateErr.style.display = 'block';
    isValid = false;
  }

  if (location.value.trim() === '') {
    locationErr.innerText = 'Location is required';
    locationErr.style.display = 'block';
    isValid = false;
  }

  if (occ.value === 'Other' && otherOcc.value.trim() === '') {
    otherOccErr.innerText = 'Other Occasion is required';
    otherOccErr.style.display = 'block';
    isValid = false;
  }

  if (!isValid) return false;
  catBtn.disabled = true;
  // const formatedDate = fdate.toISOString().split("T")[0] + " " + fdate.toTimeString().slice(0, 8);
  const reqBody = {
    branch: 'BBQHABRID100003',
    bCode: 'MPBGCB',
    bName: 'MPB Gachibowli',
    mobCc: '+91',
    name: fullName.value,
    mobileNum: phone.value,
    mobCcNum: '+91' + phone.value,
    userID: '+91' + phone.value,
    numPersons: guests.value,
    serviceFor: srvcFor.value,
    eDt: date.value,
    eDtStr: date.value,
    eLocation: location.value,
    occassion: occ.value === 'Other' ? otherOcc.value : occ.value,
    eInfo: comment.value
  }
  // fetch(`http://localhost:3001/bbqh/cust/catering-srvc/create`, {
  fetch('https://bbqh.skillworksit.com/custs/bbqh/cust/catering-srvc/create', {
    cachce: false,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody)
  }).then(response => {
    response.json().then(rData => {
      if (rData.status == '200') {
        catForm.style.display = 'none';
        catConfirm.style.display = 'block';
        catBtn.disabled = false;
      } else {
        catBtn.disabled = false;
        failMsg.style.display = 'block';
        failMsg.innerText = 'Submission Failed.';
      }
    }).catch(error => {
      catBtn.disabled = false;
      failMsg.style.display = 'block';
      failMsg.innerText = 'Server error. Please try again later.';
    });
  }).catch(err => { });
  return true;
}
