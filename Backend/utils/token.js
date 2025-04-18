import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';
const generatetokens=(userId,res)=>{
    const token =jwt.sign({userId},process.env.jwt,{expiresIn:'10d'})
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".onrender.com", // 👈 This is the key change!
        maxAge: 10 * 24 * 60 * 60 * 1000
      });
      
      
}
export default generatetokens;