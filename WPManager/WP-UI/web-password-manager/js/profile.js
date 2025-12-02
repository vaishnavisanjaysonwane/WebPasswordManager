import { getProfile, updateProfile, changePassword, deleteProfile, logoutUser } from "./service.js";

// Get user ID from localStorage
const userId = localStorage.getItem("userId");
console.log("Profile.js - Retrieved userId from localStorage:", userId);
console.log("Profile.js - localStorage contents:", {
  authToken: localStorage.getItem("authToken"),
  userId: userId,
  username: localStorage.getItem("username")
});

if (!userId) {
  console.warn("Profile.js - No userId found in localStorage, redirecting to login");
  window.location.href = "index.html";
}

// DOM Elements
const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");

const updateProfileBtn = document.getElementById("updateProfileBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

const updateProfileModal = document.getElementById("updateProfileModal");
const closeUpdateProfileModal = document.getElementById("closeUpdateProfileModal");
const updateProfileForm = document.getElementById("updateProfileForm");

const changePasswordModal = document.getElementById("changePasswordModal");
const closeChangePasswordModal = document.getElementById("closeChangePasswordModal");
const changePasswordForm = document.getElementById("changePasswordForm");
const toggleNewPassword = document.getElementById("toggleNewPassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const deleteAccountModal = document.getElementById("deleteAccountModal");
const closeDeleteAccountModal = document.getElementById("closeDeleteAccountModal");
const confirmDeleteAccountBtn = document.getElementById("confirmDeleteAccountBtn");
const cancelDeleteAccountBtn = document.getElementById("cancelDeleteAccountBtn");

const toast = document.getElementById("toast");
const logoutLink = document.querySelector(".logout");

// Helper functions
function showModal(modal) { modal.classList.add("show"); }
function hideModal(modal) { modal.classList.remove("show"); }
function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = "toast"; }, 2500);
}

// Load profile data
async function loadProfile() {
  try {
    const profile = await getProfile(userId);
    console.log("Profile loaded:", profile);
    
    profileName.textContent = profile.fullName || "Not set";
    profileUsername.textContent = profile.username || "Not set";
    profileEmail.textContent = profile.email || "Not set";

    // Update sticker initials and color
    const stickerEl = document.getElementById('profileSticker');
    if (stickerEl) {
      const usernameFromStorage = localStorage.getItem('username') || '';
      const sourceName = profile.fullName || profile.username || usernameFromStorage || '';
      let initials = '';
      if (sourceName) {
        const parts = sourceName.trim().split(/\s+/);
        if (parts.length === 1) {
          initials = parts[0].substring(0, 2);
        } else {
          initials = (parts[0][0] || '') + (parts[1][0] || '');
        }
      } else {
        initials = 'U';
      }
      initials = initials.toUpperCase();
      stickerEl.textContent = initials;

      // Pick a background color based on initials
      const colors = ['#6c63ff','#ff6b6b','#00b894','#0984e3','#fdcb6e','#e17055','#6a89cc'];
      const code = initials.charCodeAt(0) || 0;
      const color = colors[code % colors.length];
      stickerEl.style.background = color;
    }
    
    // Pre-fill update form
    document.getElementById("updateFullName").value = profile.fullName || "";
    document.getElementById("updateEmail").value = profile.email || "";
  } catch (err) {
    console.error("Error loading profile:", err);
    showToast("Error loading profile: " + err.message, "error");
  }
}

// Update Profile Handler
updateProfileBtn.addEventListener("click", () => {
  showModal(updateProfileModal);
});

closeUpdateProfileModal.addEventListener("click", () => hideModal(updateProfileModal));

updateProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("updateFullName").value;
  const email = document.getElementById("updateEmail").value;
  
  try {
    const result = await updateProfile(userId, { fullName, email });
    console.log("Profile updated:", result);
    showToast("Profile updated successfully!");
    hideModal(updateProfileModal);
    loadProfile();
  } catch (err) {
    console.error("Update error:", err);
    showToast("Error: " + err.message, "error");
  }
});

// Change Password Handler
changePasswordBtn.addEventListener("click", () => {
  changePasswordForm.reset();
  showModal(changePasswordModal);
});

closeChangePasswordModal.addEventListener("click", () => hideModal(changePasswordModal));

// Toggle password visibility
toggleNewPassword.addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementById("newPassword");
  input.type = input.type === "password" ? "text" : "password";
  toggleNewPassword.innerHTML = `<i class="fa-solid fa-eye${input.type === "password" ? "" : "-slash"}"></i>`;
});

toggleConfirmPassword.addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementById("confirmPassword");
  input.type = input.type === "password" ? "text" : "password";
  toggleConfirmPassword.innerHTML = `<i class="fa-solid fa-eye${input.type === "password" ? "" : "-slash"}"></i>`;
});

changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  if (newPassword !== confirmPassword) {
    showToast("New passwords do not match", "error");
    return;
  }
  
  try {
    const result = await changePassword(userId, oldPassword, newPassword);
    console.log("Password changed:", result);
    showToast("Password changed successfully!");
    hideModal(changePasswordModal);
    changePasswordForm.reset();
  } catch (err) {
    console.error("Change password error:", err);
    showToast("Error: " + err.message, "error");
  }
});

// Delete Account Handler
deleteAccountBtn.addEventListener("click", () => {
  showModal(deleteAccountModal);
});

closeDeleteAccountModal.addEventListener("click", () => hideModal(deleteAccountModal));
cancelDeleteAccountBtn.addEventListener("click", () => hideModal(deleteAccountModal));

confirmDeleteAccountBtn.addEventListener("click", async () => {
  try {
    const result = await deleteProfile(userId);
    console.log("Account deleted:", result);
    showToast("Account deleted. Redirecting...");
    hideModal(deleteAccountModal);
    
    // Clear localStorage
    // Clear everything and prevent back navigation
    localStorage.clear();
    try { window.history.forward(); } catch (e) {}
    // Redirect to login after 1s
    setTimeout(() => { window.location.href = "index.html"; }, 1000);
  } catch (err) {
    console.error("Delete error:", err);
    showToast("Error: " + err.message, "error");
  }
});

// Logout handler
if (logoutLink) {
  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("Logout clicked");
    try {
      const result = await logoutUser();
      console.log("Logout API response:", result);
      showToast("Logging out...", "success");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    } catch (err) {
      console.error("Logout error:", err);
      showToast("Logging out...", "success");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    }
  });
}

// Load profile on page load
window.addEventListener("DOMContentLoaded", loadProfile);
