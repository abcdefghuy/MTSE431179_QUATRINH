const {
  createUserService,
  loginService,
  getUserService,
  getDetailUser,
} = require("../services/userService");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await createUserService(name, email, password);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginService(email, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getUserService();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAccount = async (req, res) => {
  const user = await getDetailUser(req.user.email);
  return res.status(200).json(user);
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
};
