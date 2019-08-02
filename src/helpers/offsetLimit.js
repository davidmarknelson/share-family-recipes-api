module.exports = {
  checkOffset: (offset) => {
    if (offset < 0 || !offset) {
      return 0;
    } else {
      return offset;
    }
  },
  checkLimit: (limit) => {
    if (limit <= 0 || !limit) {
      return  5;
    } else {
      return limit;
    }
  }
}