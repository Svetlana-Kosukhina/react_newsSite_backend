const { News } = require('../models');
const { RESPONSE_STATUSES } = require('../constants');

module.exports = {
  async getAllNews(req, res) {
    try {
      const allNews = await News.findAll();
      return res
        .status(RESPONSE_STATUSES.OK)
        .send(allNews);
    } catch (error) {
      return res
        .status(RESPONSE_STATUSES.BAD_REQUEST)
        .send(error);
    }
  },
};