module.exports = {
  random: function(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  randomizeArray: function(arr) {
    var output = [];
    while (arr.length) {
        output.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    return output;
  }
}
