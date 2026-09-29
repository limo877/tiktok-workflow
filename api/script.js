function safe(s,max=240){return String(s||'').replace(/[<>]/g,'').trim().slice(0,max)}
const hooks={
 '痛点解决':n=>`If you deal with this every day, this ${n} is worth seeing.`,
 '前后对比':n=>`Watch how this ${n} changes the setup in under 10 seconds.`,
 '神奇工具':n=>`This simple ${n} solves a problem most people just tolerate.`,
 '测评体验':n=>`I tested this ${n} so you do not have to — here is what matters.`,
 '3个理由':n=>`Three reasons this ${n} is smarter than it looks.`,
 '中国好物介绍':n=>`This everyday product from China is surprisingly practical.`
};
export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const b=req.body||{}, name=safe(b.name,80)||'product', benefit=safe(b.benefit,220)||'solve a common daily problem', angle=safe(b.angle,20)||'痛点解决';
  const hook=(hooks[angle]||hooks['痛点解决'])(name);
  const variants=[
    hook,
    `Before you buy a ${name}, watch this first.`,
    `I did not expect this ${name} to be this useful.`
  ];
  const cn=`【0–3秒】直接展示痛点，不解释。\n【3–7秒】商品出现：${name}。\n【7–15秒】只演示最关键的两个动作：${benefit}。\n【15–23秒】给前后对比或结果证明。\n【23–28秒】主动讲一个限制，增强可信度。\n【28–33秒】CTA：如果你也有这个问题，链接在下方。`;
  const en=`0–3s: ${hook}\n3–7s: This is the ${name}.\n7–15s: Show the two clearest actions that prove it can ${benefit}.\n15–23s: Show the before/after result.\n23–28s: Mention one honest limitation.\n28–33s: If you have the same problem, I linked it below.`;
  const shots=[
    '0–2s 痛点近景/失败状态','2–5s 商品快速出现','5–10s 第一个核心动作','10–16s 第二个核心动作',
    '16–23s 前后对比','23–28s 细节/限制','28–33s CTA + 商品链接提示'
  ];
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({hook,variants,title:`${name} — useful or just hype?`,cn,en,shots,
    cta:'If you have the same problem, I linked it below.',
    cml:['clean upbeat','product demo','satisfying','light electronic'],
    hashtags:['#UsefulProducts','#ProductTest','#HomeHacks','#SmartBuy','#TikTokShop'],
    experiments:[
      {name:'A 痛点版',change:'只改前3秒：先拍最糟糕的使用痛点'},
      {name:'B 结果版',change:'先展示最终效果，再倒叙过程'},
      {name:'C 可信版',change:'前5秒直接说优点+一个限制'}
    ]});
}