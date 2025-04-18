import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';
const generatetokens=(userId,res)=>{
    const token =jwt.sign({userId},process.env.jwt,{expiresIn:'10d'})
    
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,            // ✅ Required on Render (https)
        sameSite: "none",        // ✅ Required for cross-site cookies
        maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
      });
      
}
export default generatetokens;