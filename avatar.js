/*──────────────────────────────────────────────
  AVATAR PHOTO LOAD / ERROR HANDLING
──────────────────────────────────────────────*/
(function initAvatar() {
  const photo    = document.getElementById('avatar-photo');
  const initials = document.getElementById('avatar-initials');
  const wrapper  = document.getElementById('avatar-wrapper');
  if (!photo || !initials) return;

  function onLoad() {
    // Photo loaded – fade out the initials overlay
    initials.classList.add('hidden');
    photo.classList.add('loaded');
  }

  function onError() {
    // Photo failed to load – keep initials visible, hide broken image
    photo.style.display = 'none';
    initials.style.opacity = '1';
  }

  // Already loaded (e.g. cached)
  if (photo.complete && photo.naturalWidth > 0) {
    onLoad();
  } else {
    photo.addEventListener('load', onLoad);
    photo.addEventListener('error', onError);
  }
})();
