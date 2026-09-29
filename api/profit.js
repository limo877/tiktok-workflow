const pct=n=>Math.max(0,Number(n)||0)/100;
export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const b=req.body||{}, views=Math.max(0,Number(b.views)||0), price=Math.max(0,Number(b.price)||0);
  const ctr=pct(b.ctr), cvr=pct(b.cvr), cr=pct(b.commissionRate), rr=Math.min(.95,pct(b.refundRate));
  const clicks=views*ctr, orders=clicks*cvr, gmv=orders*price, gross=gmv*cr, net=gross*(1-rr);
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({
    clicks:Math.round(clicks),orders:Number(orders.toFixed(1)),gmv:Number(gmv.toFixed(2)),
    grossCommission:Number(gross.toFixed(2)),netCommission:Number(net.toFixed(2)),
    rpm:Number((views?net/views*1000:0).toFixed(2)),
    perOrder:Number((orders?net/orders:0).toFixed(2))
  });
}