const validateEditProfile = (req) => {
  const allowedEditFields = ["firstName", "lastName", "skills", "about"];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateEditProfile };
