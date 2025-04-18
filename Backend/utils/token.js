import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';
const generatetokens=(userId,res)=>{
    const token =jwt.sign({userId},process.env.jwt,{expiresIn:'10d'})
    
    res.cookie("jwt", token, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    
}
export default generatetokens;