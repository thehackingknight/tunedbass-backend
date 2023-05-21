const checkAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()) return next()
    else res.redirect('/auth/fail')
  }

  const genUID = ()=>{
    return Date.now() + "-" + Math.round(Math.random() * 1e9);
  }
module.exports = { checkAuthenticated, genUID }