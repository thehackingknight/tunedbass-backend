const checkAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()) return next()
    else res.redirect('/auth/fail')
  }

module.exports = { checkAuthenticated }