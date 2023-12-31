const { unlink } = require('node:fs/promises');

const { Users } = require('../../models');
const { RESPONSE_STATUSES } = require('../../constants');
const { ERROR_MESSAGE } = require('../../errorMessages');

module.exports = {
  async editProfile(req, res) {
    try {
      const {
        params: {
          id,
        },
        user,
        files: {
          picture,
        },
        body: {
          email,
          login,
        },
      } = req;

      if (+id === +user.id) {
        const date = Date.now();
        const pictureName = `images/${date}${picture.name}`;

        const payload = {};

        const userLogin = login ? login.trim() : '';
        const userEmail = email ? email.trim() : '';

        if (userLogin !== '') {
          payload.login = userLogin;
        }

        if (userEmail !== '') {
          payload.email = userEmail;
        }

        if (picture) {
          try {
            await unlink(`public/${user.picture}`);
            await picture.mv(`public/${pictureName}`);
            payload.picture = pictureName;
          } catch (error) {
            return res
              .status(RESPONSE_STATUSES.NOT_FOUND)
              .send(ERROR_MESSAGE.NOT_FOUND);
          }
        }

        await Users.update(
          payload,
          { where: { id } },
        );
        const editedUser = await Users.findOne(
          {
            attributes: ['login', 'id', 'email', 'firstName', 'lastName', 'picture'],
            where: { id },
          },
        );
        return res
          .status(RESPONSE_STATUSES.OK)
          .send({ user: editedUser });
      }
      return res
        .status(RESPONSE_STATUSES.BAD_REQUEST)
        .send(ERROR_MESSAGE.INVALID_ID);
    } catch (error) {
      return res
        .status(RESPONSE_STATUSES.INTERNAL_SERVER_ERROR)
        .send(error.message);
    }
  },
};
