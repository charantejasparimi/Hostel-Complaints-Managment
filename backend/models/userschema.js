const validateUserData = (email, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return "Invalid email address";
  }
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};
module.exports = { validateUserData };
