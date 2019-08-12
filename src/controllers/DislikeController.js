const Dev = require("../schema/Dev");

const api = require("../services/api");

module.exports = {
  async store(request, response) {
    try {
      const { devId } = request.params;
      const { user } = request.headers;

      const loggedDev = await Dev.findById(user);
      const targetDev = await Dev.findById(devId);

      if (!targetDev) {
        return response.status(400).json({ error: "Dev does not exist" });
      }

      if (loggedDev.dislikes.includes(targetDev._id)) {
        return response.json(loggedDev);
      }

      loggedDev.dislikes.push(targetDev._id);
      await loggedDev.save();

      return response.json(loggedDev);
    } catch (err) {
      return response.status(500).json(err);
    }
  }
};
