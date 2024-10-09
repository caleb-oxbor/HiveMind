module.exports = function async(req, res, next){
    const {email, name, password} = req.body;

    function validEmail(userEmail) {
        const regex = /^\w+([\.-]?\w+)*@ufl\.edu$/; //regex to enforce @ufl.edu domain
        if (!regex.test(userEmail)) {
            return false;
        }
        return regex.test(userEmail);
    }

    if (req.path === "/register") {
        console.log(!email.length);
        if (![email, name, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
        } else if (req.path === "/login") {
        //fill in login logic 
        }
    
        next();
    
}