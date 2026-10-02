import app from './index.mjs';
const port=Number(process.env.PORT||3000);app.listen(port,()=>console.log(`Venom app: http://localhost:${port}`));
