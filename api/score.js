const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function rateLimited(req){
  const ip=(req.headers['x-forwarded-for']||'unknown').toString().split(',')[0].trim();
  globalThis.__mmRate=globalThis.__mmRate||new Map();
  const now=Date.now(), win=60_000, max=60;
  const arr=(globalThis.__mmRate.get(ip)||[]).filter(t=>now-t<win);
  if(arr.length>=max)return true;
  arr.push(now);globalThis.__mmRate.set(ip,arr);return false;
}
export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  if(rateLimited(req)) return res.status(429).json({error:'Too many requests'});
  const b=req.body||{};
  const metrics=['visual','pain','demoEase','commissionAttractiveness','competitionFriendly','aiFit'];
  const vals=metrics.map(k=>clamp(Number(b[k])||0,1,10));
  const weights=[.20,.20,.18,.17,.12,.13];
  const score=Math.round(vals.reduce((a,x,i)=>a+x*weights[i],0)*10);
  const price=Math.max(0,Number(b.price)||0), rate=clamp(Number(b.commissionRate)||0,0,100)/100;
  const perOrder=price*rate;
  const tier=score>=82?'A':score>=70?'B':score>=58?'C':'D';
  const bottlenecks=metrics.map((k,i)=>({k,v:vals[i]})).sort((a,b)=>a.v-b.v).slice(0,2).map(x=>x.k);
  const verdict=score>=82?'优先测试':score>=70?'值得小测':score>=58?'谨慎测试':'暂不优先';
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({score,tier,verdict,perOrder:Number(perOrder.toFixed(2)),bottlenecks,
    next: score>=70?'先做3个不同Hook，48小时只看CTR、CVR和千播收益。':'先换商品或提升最低的两个维度，再投入制作。'});
}