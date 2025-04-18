import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';
const generatetokens=(userId,res)=>{
    const token =jwt.sign({userId},process.env.jwt,{expiresIn:'10d'})
    
    res.cookie("jwt",token,{
        maxAge:10*24*60*1000,
        httpOnly:true,//xss 
        sameSite:'strict',//csrf
        secure:process.env.NODE_ENV!=='developmen',
    })
}
export default generatetokens;