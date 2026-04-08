function capitalizeFirstLetters(str) {
  return str.replace(/\b\w/g, function(match) {
    return match.toUpperCase();
  });
}
function nameChange() {
  const nameInput = document.getElementById("contact-person");
  nameInput.value = capitalizeFirstLetters(nameInput.value);
}
function commonNameChange() {
  const nameInput = document.getElementById("name");
  nameInput.value = capitalizeFirstLetters(nameInput.value);
}
function occTypeChange() {
  const nameInput = document.getElementById("other-occation-type");
  nameInput.value = capitalizeFirstLetters(nameInput.value);
}

/* Whatsapp JS */
function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
  return regex.test(navigator.userAgent);
}

function whatsappclick() {
  if (isMobile()) {
    let url = "https://api.whatsapp.com/send?phone=919948000818";
    window.open(url, "_blank");
  } else {
    let url = "https://web.whatsapp.com/send?phone=919948000818";
    window.open(url, "_blank");
  }
}
