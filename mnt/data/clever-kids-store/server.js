const express=require('express');
const path=require('path');
const fs=require('fs');
const crypto=require('crypto');
const app=express();
const PORT=process.env.PORT||3000;
const ROOT=__dirname;
app.use(express.json());
app.use(express.static(path.join(ROOT,'public'),{extensions:['html']}));

const catalog={adventure:{name:'Adventure Edition',price:299,file:'adventure-edition.pdf'},explorer:{name:'Explorer Edition',price:299,file:'explorer-edition.pdf'}};
const secret=process.env.DOWNLOAD_SECRET||'replace-this-before-production';

function makeToken(orderId,productId){const payload=`${orderId}:${productId}`;const sig=crypto.createHmac('sha256',secret).update(payload).digest('hex');return Buffer.from(`${payload}:${sig}`).toString('base64url')}
function readToken(token){try{const raw=Buffer.from(token,'base64url').toString();const [orderId,productId,sig]=raw.split(':');const good=crypto.createHmac('sha256',secret).update(`${orderId}:${productId}`).digest('hex');if(!orderId||!productId||!sig||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(good)))return null;return {orderId,productId}}catch{return null}}

app.post('/api/checkout',(req,res)=>{
  const items=Array.isArray(req.body.items)?req.body.items:[];
  if(!items.length)return res.status(400).json({message:'Cart is empty.'});
  // Demo-safe checkout endpoint. Replace this branch with your chosen payment provider's server-side order creation.
  const ids=items.includes('bundle')?['adventure','explorer']:[...new Set(items.filter(x=>catalog[x]))];
  if(!ids.length)return res.status(400).json({message:'No valid products selected.'});
  const orderId='CK-'+Date.now().toString(36).toUpperCase();
  if(process.env.PAYMENT_CHECKOUT_URL){
    // Provider handoff pattern: your payment server can point this to a hosted checkout and append order metadata.
    const url=new URL(process.env.PAYMENT_CHECKOUT_URL);
    url.searchParams.set('order_id',orderId);url.searchParams.set('items',ids.join(','));
    return res.json({url:url.toString()});
  }
  // Local demonstration mode: shows the post-purchase delivery page without taking payment.
  const tokens=ids.map(id=>makeToken(orderId,id));
  res.json({url:`/success.html?order=${encodeURIComponent(orderId)}&tokens=${encodeURIComponent(tokens.join(','))}`,demo:true});
});

app.get('/download',(req,res)=>{
  const verified=readToken(req.query.token||''); if(!verified)return res.status(403).send('Invalid or expired download link.');
  const p=catalog[verified.productId]; if(!p)return res.status(404).send('Product not found.');
  const file=path.join(ROOT,'private',p.file); if(!fs.existsSync(file))return res.status(404).send('Digital file is not configured yet.');
  res.download(file,`Clever-Kids-${verified.productId}.pdf`);
});

app.get('/api/health',(req,res)=>res.json({ok:true,service:'clever-kids-store'}));
app.listen(PORT,()=>console.log(`Clever Kids running at http://localhost:${PORT}`));
