/*──────────────────────────────────────────────
  AVATAR PHOTO LOAD / ERROR HANDLING
──────────────────────────────────────────────*/
(function initAvatar() {
  const photo = document.getElementById('avatar-photo');
  if (!photo) return;

  function onError() {
    // Photo failed – hide broken image icon
    photo.style.display = 'none';
  }

  if (photo.complete && photo.naturalWidth === 0) {
    onError();
  } else {
    photo.addEventListener('error', onError);
  }
})();
