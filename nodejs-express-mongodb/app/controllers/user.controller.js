const db = require("../models");
const User = db.users;

exports.create = async (req, res) => {
  if (!req.body.nickname) {
    res.send({ status: 'faild', message: "Content can not be empty!" });
    return;
  }
  const user = await User.find({ nickname: req.body.nickname });
  if (user.length > 0) {
    res.send({ status: 'faild', message: 'User already exist.' });
    return;
  }
  const code = req.body.nickname + req.body.address.slice(5, 20);
  const newuser = new User({
    nickname: req.body.nickname,
    address: req.body.address,
    code: code
  });

  newuser
    .save(newuser)
    .then(data => {
      res.send({ data: data, status: 'success' });
    })
    .catch(err => {
      res.send({
        status: 'faild',
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

exports.findOne = (req, res) => {
  const code = req.params.code;

  User.findOne({code: code})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with code " + code });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with code=" + code });
    });
};