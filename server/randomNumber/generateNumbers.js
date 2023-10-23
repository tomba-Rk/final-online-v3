const between=(min, max)=> {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
  }
  
  // Example:
  
  module.exports = {between};