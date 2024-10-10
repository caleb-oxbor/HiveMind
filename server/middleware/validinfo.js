module.exports = function async(req, res, next) {
    const { email, password } = req.body;
    function validEmail(userEmail) {
        const generalEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
        return generalEmailRegex.test(userEmail);
    }
    //ufl check
    function isUFLEmail(userEmail) {
        const uflEmailRegex = /^\w+([\.-]?\w+)*@ufl\.edu$/; 
        return uflEmailRegex.test(userEmail);
    }

    if (req.path === "/register") {
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials.");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        } else if (!isUFLEmail(email)) {
            return res.status(403).json("Email must end in @ufl.edu."); 
        }
    } 

    else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } 
        else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }
    
    next();
    
};
