const Dev = require('../schema/Dev');

module.exports = {
  async store(request, response) {
    try {
      const { devId } = request.params;
      const { user } = request.headers;

      const loggedDev = await Dev.findById(user);
      const targetDev = await Dev.findById(devId);

      if (!targetDev) {
        return response.status(400).json({ error: 'Dev is not exist' });
      }

      if (loggedDev.likes.includes(targetDev._id)) {
        return response.json(loggedDev);
      }

      if (targetDev.likes.includes(loggedDev._id)) {
        try {
          const loggedSocket = request.connectedUsers[user];
          const targetSocket = request.connectedUsers[devId];

          if (loggedSocket) {
            request.io.to(loggedSocket).emit('match', targetDev);
          }

          if (targetSocket) {
            request.io.to(targetSocket).emit('match', loggedDev);
          }
        } catch (err) {
          console.log(err);
        }
      }

      loggedDev.likes.push(targetDev._id);
      await loggedDev.save();

      return response.json(loggedDev);
    } catch (err) {
      return response.status(500).json(err);
    }
  }
};
