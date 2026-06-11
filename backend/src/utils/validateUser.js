function validateUser(user, isUpdate = false) {
  if (!user.username) {
    return {
      error: true,
      message: "username é obrigatório",
    };
  }

  if (!user.email) {
    return {
      error: true,
      message: "email é obrigatório",
    };
  }

  if (!user.birth_date) {
    return {
      error: true,
      message: "birth_date é obrigatório",
    };
  }

  if (!isUpdate && !user.password) {
    return {
      error: true,
      message: "password é obrigatório",
    };
  }

  return null;
}

export default validateUser;
