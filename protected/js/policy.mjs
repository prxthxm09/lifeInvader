export const businesses=['private business','family business','Ammunition Store','ATM','Bar','Burger Shop','Chip Tuning','Car Wash','Car Sharing','Clothing Shop','Cowshed','Electric Charging Station','Farm','Fight Club Bar','Freight Train','Furniture Store','Gas Station','Grand Elite Clothing Shop','Hair Salon','Jewellery Store','Juice Shop','Oil Well','Parking','Pet Shop','Plantation','Service Station','State Object','Tattoo Studio','Taxi Company','Warehouse','24/7 Store','Luna Amusement Park'];
export const locations=['near Auto Salon','near Bahama Mamas Bar','in Banham Canyon','near Business Center','near Capitol','near the Casino','in Cayo Perico Island','in Chumash','near the Church','in Del Perro','near Diamond Bar','in Downtown Vinewood','in Eclipse Tower','in El Burro Heights','near Fight Club','near Hospital','near Sandy Hospital','near LifeInvader','in Little Seoul','in Mirror Park','in Richards Majestic','in Richman','in Rockford Hills','near Pacific Bluffs Country Club','in Paleto Bay','in Pillbox Hill','in Rancho','in Sandy Shores','near Tequi-La-La Bar','near Vanilla Unicorn Bar','in Vespucci Canals','in Vinewood Hills','in West Vinewood','near beach','near beach market','in city','near fire station','near post office','near stadium','near train station',...Array.from({length:8},(_,i)=>`in Residential Complex №${i+1}`)];
export const join=(a,conjunction='and')=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+` ${conjunction} `+a.at(-1);
export const article=s=>/^(hour|honest|honor|heir)/i.test(s)?'an':/^(uni(?:que|vers|form)|user|usual|euro|one)/i.test(s)?'a':/^[aeiou]/i.test(s)?'an':'a';
export function parseMoney(raw){
 let s=String(raw??'').trim().replace(/^\$/,'').trim();if(!s||/^negotiable$/i.test(s))return null;
 const m=s.match(/^(\d[\d.,]*)(?:\s*)(k|m|b|thousand|million|billion)?$/i);if(!m)throw Error('Enter a valid amount or Negotiable.');
 let number=m[1];const suffix=m[2]?.toLowerCase();
 if(/^\d{1,3}([.,]\d{3})+$/.test(number))number=number.replace(/[.,]/g,'');else if(number.includes(',')) {if(number.includes('.'))throw Error('Use one decimal separator.');number=number.replace(',','.');}
 if(!/^\d+(\.\d+)?$/.test(number))throw Error('Enter a valid amount.');
 const value=Number(number)*({k:1e3,thousand:1e3,m:1e6,million:1e6,b:1e9,billion:1e9}[suffix]??1);
 if(!Number.isFinite(value)||value<=0||!Number.isSafeInteger(Math.round(value)))throw Error('The amount must be positive and within a valid numeric range.');return value;
}
export function money(raw,category,warnings=[]){let n=parseMoney(raw);if(n!==null&&((!['property','business'].includes(category)&&n>1e9)||(category==='property'&&n<1e6))){warnings.push(category==='property'?'Property prices below $1 Million changed to Negotiable.':'Amounts above $1 Billion changed to Negotiable.');n=null;}
 if(n===null)return 'Negotiable';if(n>=1e9)return '$'+Number((n/1e9).toFixed(6))+' Billion';if(n>=1e6)return '$'+Number((n/1e6).toFixed(6))+' Million';return '$'+Math.round(n).toLocaleString('en-US').replaceAll(',','.');}
export const end=s=>/\d$/.test(s)?s:s.endsWith('.')?s:s+'.';
export function plural(s){const fixed=['fish','carp','salmon','perch','trout','copper','milk','metal','timber','fuel','fruit','sand','snow','obsidian','earplugs','binoculars','fireworks','brakes','pants','jeans','shorts','trousers','leggings','sweatpants','shoes','sneakers','boots','gloves','tights','tokens','seeds','flowers','chargers'];const split=s.match(/^(.*?)(\s+(?:of|for|with)\b.*|\s+\(V\..*)$/i);let base=split?split[1]:s,tail=split?split[2]:'';let words=base.split(' ');let w=words.pop(),low=w.toLowerCase();
 const irregular={battery:'batteries',ruby:'rubies',strawberry:'strawberries',scarf:'scarves',elf:'elves',woman:'women',man:'men',mouse:'mice',wife:'wives'};
 if(fixed.includes(low)||low.endsWith('s'))return s;if(irregular[low])w=irregular[low];else if(/[^aeiou]y$/i.test(w))w=w.slice(0,-1)+'ies';else if(/(?:x|z|ch|sh)$/i.test(w))w+='es';else w+='s';return [...words,w].join(' ')+tail;}
function assertMode(mode,allowed){if(!allowed.includes(mode))throw Error('This transaction is not allowed for this category.');}
function quantity(v){if(v===''||v===undefined||v===null)return null;const n=Number(String(v).replaceAll('.',''));if(!Number.isSafeInteger(n)||n<1)throw Error('Quantity must be a positive whole number.');return n;}
function number(v,label='Number'){if(!/^\d+$/.test(String(v)))throw Error(`${label} must contain digits only.`);return String(v);}
function safeLocation(v,business=false){if(!v)return '';const s=locations.find(x=>x.toLowerCase()===v.toLowerCase());if(!s)throw Error('Select a listed location.');if(!business&&/airport|\bmall\b/i.test(s))throw Error('This location is only allowed for business ads.');return s;}
function selected(name,records,label,gender){const r=records.find(r=>r.name===name&&(!gender||!r.gender||r.gender===gender));if(!r)throw Error(`${label} not found in the catalogue. Submit proof of tradeability to LI.`);return r;}
export function makeAd(category,data,catalog){const warnings=[];let text;const mode=data.mode;
 if(category==='vehicle'){
  assertMode(mode,['Buying','Selling','Trading','Selling or trading']);let name;
  if(data.generic||(mode==='Buying'&&!String(data.name||'').trim())){const kinds=['car','electric car','motorcycle','motorbike','bike','boat','plane','helicopter'];if(!kinds.includes(data.kind))throw Error('Select a valid vehicle type.');name=`${article(data.kind)} ${data.kind}`;}else{name=`“${selected(data.name,catalog.vehicles,'Vehicle').name}”`;}
  text=`${mode} ${name}`;
  if(data.config){if(!['full','partial'].includes(data.config))throw Error('Invalid configuration.');text+=` in ${data.config} configuration`;}
  const extras=['visual upgrades','insurance','tuning parts','turbo kit','drift kit'].filter(x=>data.extras?.includes(x));if(extras.includes('turbo kit')&&extras.includes('drift kit'))extras.splice(extras.indexOf('turbo kit'),2,'turbo and drift kit');if(extras.length)text+=' with '+join(extras);
  if(mode.includes('trading')||mode==='Trading'){if(data.target)text+=` for “${selected(data.target,catalog.vehicles,'Vehicle').name}”`;}
  text+='.';if(mode!=='Trading')text+=` ${mode==='Buying'?'Budget':'Price'}: ${money(data.price,'vehicle',warnings)}`;
 }else if(category==='property'){
  assertMode(mode,['Buying','Selling','Renting out','Looking to rent']);const types=['house','apartment','mansion','Casino penthouse','family','house and apartment'];if(!types.includes(data.type))throw Error('Select a property type.');
  const mixed=data.type==='house and apartment';const count=mixed?2:Number(data.count||1);if(![1,2].includes(count)||data.type==='family'&&count!==1)throw Error('Maximum two properties or one family per ad.');
  let nums=(data.numbers||'').split(/[ ,]+/).filter(Boolean);nums.forEach(v=>number(v,'Property number'));if(nums.length>count)throw Error('Too many property numbers.');if(nums.length&&nums.length!==count&&['Selling','Renting out'].includes(mode))throw Error('Enter one number for each advertised property.');
  if(['Buying','Looking to rent'].includes(mode)&&nums.length){nums=[];warnings.push('Specific property numbers removed from the buying/rental request.');}
  if(mixed&&nums.length)throw Error('For mixed property ads, omit numbers and features.');if(data.type==='family'&&nums.length)throw Error('Family names or numbers cannot be advertised.');
  const tier=data.family;if(tier&&!['family','advanced family','elite family','standard family'].includes(tier))throw Error('Invalid family tier.');
  const base=data.type==='family'?(tier||'family'):data.type;
  text=`${mode} `+(mixed?'a house and an apartment':nums.length?`${count===2?plural(base):base} ${join(nums.map(n=>'№'+n))}`:count===2?'2 '+plural(base):`${article(base)} ${base}`);
  const f=[];if(data.type!=='family'&&!mixed){
   if(tier) {if(count===2)throw Error('Only one family may be promoted per ad.');f.push(`${article(tier)} ${tier}`);}
   if(data.garden){if(data.type==='apartment'||data.type==='Casino penthouse')throw Error('Apartments cannot have gardens.');f.push(count===2?'gardens':'a garden');}
   if(data.garage){if(![2,5,9,25,30].includes(Number(data.garage)))throw Error('Invalid garage spaces.');f.push(data.garage+' g.s.');}
   if(data.warehouse){if(![3,4,5].includes(Number(data.warehouse)))throw Error('Invalid warehouse spaces.');f.push(data.warehouse+' w.h.');}
   for(const a of ['custom interior','insurance','helipad','tennis court','long driveway','swimming pool'])if(data.features?.includes(a))f.push(count===2&&a!=='insurance'?plural(a):a);
   if(data.view){if(!['nice','beautiful','great','good'].includes(data.view))throw Error('Invalid view.');f.push(data.view+' view');}
  }
  if(mixed&&(tier||data.garden||data.garage||data.warehouse||data.features?.length||data.view||data.location))throw Error('Mixed house/apartment ads must mention only the property types.');if(f.length)text+=' with '+join(f);const loc=safeLocation(data.location);if(loc)text+=' '+loc;
  let n=parseMoney(data.price);if(data.type==='family'&&tier&&/advanced|elite/.test(tier)&&n!==null&&n<1e7){warnings.push('Advanced/elite family prices below the listed $10 Million value changed to Negotiable.');n=null;}
  const renting=mode==='Renting out'||mode==='Looking to rent';text+=`. ${mode==='Renting out'?'Rent':mode==='Buying'||mode==='Looking to rent'?'Budget':'Price'}: ${money(n===null?'Negotiable':String(n),renting?'rent':data.type==='family'?'family':'property',warnings)}`;
  if(renting&&data.period){if(!['per day','per week','for 7 days'].includes(data.period))throw Error('Invalid rental period.');text+=' '+data.period;}
 }else if(category==='business'){
  assertMode(mode,['Buying','Selling']);if(!businesses.includes(data.name))throw Error('Select a listed business.');let name=data.name;
  if(name==='Plantation'){if(data.beds&&!['10','15','20'].includes(String(data.beds)))throw Error('Invalid plantation size.');if(data.crop&&!['Cabbage','Pineapple','Pumpkin','Mandarin'].includes(data.crop))throw Error('Invalid plantation crop.');name=[data.beds?data.beds+'-Bed':'',data.crop,'Plantation'].filter(Boolean).join(' ');}
  if(data.number){number(data.number,'Business number');if(/private|family/.test(name))throw Error('Select a business type before adding a number.');name+=' №'+data.number;}else if(!name.endsWith('business'))name+=' business';
  const loc=data.location&&['near airport','near mall','in mall'].includes(data.location)?data.location:safeLocation(data.location,true);text=`${mode} ${name}${loc?' '+loc:''}. ${mode==='Buying'?'Budget':'Price'}: ${money(data.price,'business',warnings)}`;
 }else if(category==='items'||category==='clothing'){
  assertMode(mode,['Buying','Selling','Trading','Selling or trading']);const rows=data.items||[];if(!rows.length||rows.length>3)throw Error('Use one to three items per ad.');if(mode==='Trading'&&rows.length!==2)throw Error('Trading requires exactly two item entries.');
  let plates=0,sims=0;let groupCategory=new Set();const descriptions=rows.map(row=>{
   const rec=selected(row.name,category==='clothing'?catalog.clothing:[...catalog.items,...catalog.clothing],'Item',row.gender);let name=rec.name;const q=quantity(row.quantity);const bulk=!!data.bulk&&q===null;const many=(q??1)>1||bulk;
   groupCategory.add(category==='clothing'?'other':'other');
   if(rec.variantKind){const value=String(row.variant||'');if(rec.variantKind==='version'){if(!/^\d+$/.test(value)||Number(value)<1)throw Error('Enter the actual skin version number.');name+=` (V.${value})`;}else{if(!rec.variants.includes(value))throw Error(`Select a valid variant for ${rec.name}.`);if(['quality','percent','size'].includes(rec.variantKind))name=value+' '+name;else if(rec.variantKind==='type')name+=' of type '+value;else name+=' '+value;}}
   if(category==='clothing'||catalog.clothing.includes(rec)){
    if(row.gender&&!['for men','for women'].includes(row.gender))throw Error('Invalid gender.');if(rec.gender&&row.gender&&rec.gender!==row.gender)throw Error('Select clothing from the matching catalogue section.');
    if(row.type){if(!/^\d+$/.test(String(row.type))||Number(row.type)<1)throw Error('Type must be a positive whole number.');if(/of type/.test(name))throw Error('The selected classified item already has a type.');name+=' of type '+row.type;}
    if(row.luminous&&!/luminous/i.test(name))name='luminous '+name;
    if(row.color){if(!['red','blue','green','black','white','yellow','purple','orange','pink','gray','grey','gold','silver'].includes(row.color))throw Error('Select a listed colour.');if(rec.fixed)throw Error('The classification guide already defines this item’s colour.');name=row.color+' '+name;}
    if(many)name=rec.plural||plural(name);if(row.gender||rec.gender)name+=' '+(row.gender||rec.gender);
   }else if(/^license plate$/.test(name)){
    plates+=q??1;if(plates>1||bulk)throw Error('Maximum one license plate per ad.');if(row.special)name='special license plate';else{if(!/^[A-Z0-9]{1,8}$/i.test(row.detail||''))throw Error('Enter an alphanumeric plate or select Special plate.');if(/fuck|shit|bitch|hitler|stalin|epstein/i.test(row.detail)){name='special license plate';warnings.push('Inappropriate plate text omitted.');}else name=`license plate (${row.detail.toUpperCase()})`;}
   }else if(/^sim-card/.test(name)){
    const numbers=(row.detail||'').split(/[ ,]+/).filter(Boolean);if(!numbers.length||numbers.some(n=>!/^\d{2}-\d{2}-\d{3}$/.test(n)))throw Error('Use sim-card numbers in XX-XX-XXX format.');sims+=numbers.length;if(sims>2||bulk)throw Error('Maximum two sim-cards per ad.');if(q!==null&&q!==numbers.length)throw Error('The sim-card quantity must match its numbers.');name=numbers.length===1?'sim-card with number '+numbers[0]:'sim-cards with numbers '+join(numbers);return name;
   }else if(many)name=rec.plural||plural(name);
   name=name.replace(/\brare\b/gi,'exclusive').replace(/\blegendary\b/gi,'unique');
   return (q!==null?q.toLocaleString('en-US').replaceAll(',','.')+' ':'')+name+(bulk?' in bulk':'');
  });
  text=`${mode} ${mode==='Trading'?descriptions.join(' for '):join(descriptions,mode==='Buying'?'or':'and')}.`;
  if(mode!=='Trading'){
   const prices=rows.map(r=>money(r.price,category,warnings)+(r.each?' each':''));const same=prices.every(p=>p===prices[0]);text+=` ${mode==='Buying'?'Budget':'Price'}: `+(same?prices[0]:join(prices)+' respectively');
  }
  if(data.market){if(mode!=='Selling')throw Error('Market stall ads must use Selling.');const ending=data.market==='beach'?`at beach market shop №${number(data.marketNumber,'Shop number')}`:`at private market stall next to ${data.stallHouse?'house №'+number(data.stallHouse,'House number'):safeLocation(data.stallLocation).replace(/^(in|near) /,'')}`;if(data.market!=='beach'&&!data.stallHouse&&!data.stallLocation)throw Error('Select a stall location or enter a house number.');text=`Selling ${join(descriptions)}${data.goodPrices?' for good prices':''} ${ending}.`;warnings.push('Prices omitted from market stall ads.');}
 }else throw Error('Unknown ad category.');
 text=end(text);const count=Array.from(text).length;if(count>150)throw Error(`Ad is ${count} characters; the limit is 150. Remove optional details or split the ad.`);return {text,count,warnings,category:category==='clothing'||category==='items'?'Other':category==='vehicle'?'Auto':category==='property'?'Real Estate':'Businesses'};
}
