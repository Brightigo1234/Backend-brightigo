const User = require('../model/auth.model');

exports.readController = (req, res) => {
  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

exports.updateController = (req, res) => {
  const { name, _id, phoneNumber, profilePicture } = req.body;
  User.findOne({ _id: _id }, (err, user) => {
    if (err || !user) {
      console.log(err);
      return res.status(400).json({
        error: 'User not found',
      });
    }
    if (!name) {
      return res.status(400).json({
        error: 'Name is required',
      });
    } else {
      user.name = name;
    }

    if (!profilePicture) {
      return res.status(400).json({
        error: 'Mobile Number not updated',
      });
    } else {
      user.profilePicture = profilePicture;
    }

    if (!profilePicture) {
      return res.status(400).json({
        error: 'Profile Picture not updated',
      });
    } else {
      user.phoneNumber = phoneNumber;
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log('USER UPDATE ERROR', err);
        return res.status(400).json({
          error: 'User update failed',
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};

exports.updateUserScoreController = (req, res) => {
  const { id } = req.params;
  const { score, max, percentage, grade } = req.body;

  User.findOne({ _id: id }, (err, user) => {
    if (err || !user) {
      console.log(err);
      console.log(user);
      return res.status(400).json({
        error: 'User not found',
      });
    }
    console.log('grade - ', grade);
    if (!grade) {
      return res.status(400).json({
        error: 'test grade not added',
      });
    } else {
      user.test.score = score;
      user.test.grade = grade;
      user.test.max = max;
      user.test.percentage = percentage;
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log('USER UPDATE ERROR', err);
        return res.status(400).json({
          error: 'User update failed',
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json({ message: 'test score added successfully' });
    });
  });
};
