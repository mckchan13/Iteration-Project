const socketUtil = {
  users: [],
  userId: [],
  addUser(userId, socketId) {
    !this.users.some((user) => user.userId === userId) &&
      this.users.push({ userId, socketId });
  },
  removeUser(socketId) {
    socketUtil.users = this.users.filter((elem) => {
      elem.socketId !== socketId;
    });
  },
  getUser(receiverId) {
    return this.users.find((user) => user.userId === receiverId);
  },
};

module.exports = socketUtil;
