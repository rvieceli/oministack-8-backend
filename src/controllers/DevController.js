const api = require("../services/api");
const Dev = require("../schema/Dev");

module.exports = {
  async index(request, response) {
    const { user } = request.headers;

    const loggetDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggetDev.likes } },
        { _id: { $nin: loggetDev.dislikes } }
      ]
    });

    return response.json(users);
  },

  async store(request, response) {
    try {
      const { username } = request.body;

      const devExists = await Dev.findOne({ user: username });

      if (devExists) {
        return response.json(devExists);
      }

      const apiResponse = await api.get(`/users/${username}`);

      const { name, bio, avatar_url: avatar } = apiResponse.data;

      const dev = await Dev.create({
        name,
        user: username,
        bio,
        avatar
      });

      return response.json(dev);
    } catch (err) {
      return response.status(500).json(err);
    }
  }
};
