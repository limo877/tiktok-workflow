export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({ok:true,service:'TikTok Money Machine API',version:'3.0.0',time:new Date().toISOString()});
}