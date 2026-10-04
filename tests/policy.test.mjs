import {makeAd,money,plural,parseMoney} from '../protected/js/policy.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
const c=JSON.parse(fs.readFileSync(new URL('../protected/catalog.json',import.meta.url)));let n=0;
function eq(actual,expected){assert.equal(actual,expected);n++;}function bad(cat,data,re){assert.throws(()=>makeAd(cat,data,c),re);n++;}
eq(money('4.5m','vehicle'),'$4.5 Million');eq(money('4.000','vehicle'),'$4.000');eq(money('1,000','vehicle'),'$1.000');eq(money('2b','vehicle'),'Negotiable');eq(money('2b','business'),'$2 Billion');eq(money('999999','property'),'Negotiable');eq(money('1000000','property'),'$1 Million');eq(money('1b','vehicle'),'$1 Billion');eq(parseMoney(''),null);
eq(plural('battery'),'batteries');eq(plural('desert scarf mask'),'desert scarf masks');eq(plural('ruby'),'rubies');eq(plural('pet Christmas elf'),'pet Christmas elves');eq(plural('fish'),'fish');eq(plural('milk'),'milk');eq(plural('fuel for resource extraction'),'fuel for resource extraction');
eq(makeAd('vehicle',{mode:'Selling',name:'Ubermacht M5 (E34)',price:'4.5m'},c).text,'Selling “Ubermacht M5 (E34)”. Price: $4.5 Million.');
eq(makeAd('vehicle',{mode:'Buying',generic:true,kind:'electric car'},c).text,'Buying an electric car. Budget: Negotiable.');
eq(makeAd('vehicle',{mode:'Trading',name:'Adder',target:'Baller'},c).text,'Trading “Adder” for “Baller”.');
bad('vehicle',{mode:'Selling',name:'Not a vehicle'},/not found/);bad('vehicle',{mode:'Trading',name:'Adder',target:'house'},/not found/);
eq(makeAd('property',{mode:'Selling',type:'house',count:2,numbers:'1 2',garden:true,garage:30,features:['insurance','helipad'],price:'1m'},c).text,'Selling houses №1 and №2 with gardens, 30 g.s., insurance and helipads. Price: $1 Million.');
eq(makeAd('property',{mode:'Buying',type:'apartment',numbers:'12',price:'500k'},c).text,'Buying an apartment. Budget: Negotiable.');
eq(makeAd('property',{mode:'Renting out',type:'house',numbers:'12',price:'200k',period:'per week'},c).text,'Renting out house №12. Rent: $200.000 per week.');
eq(makeAd('property',{mode:'Selling',type:'house and apartment'},c).text,'Selling a house and an apartment. Price: Negotiable.');
bad('property',{mode:'Trading',type:'house'},/not allowed/);bad('property',{mode:'Selling',type:'house',garage:10},/garage/);bad('property',{mode:'Selling',type:'apartment',garden:true},/gardens/);
eq(makeAd('business',{mode:'Buying',name:'24/7 Store',number:'27',price:'2b'},c).text,'Buying 24/7 Store №27. Budget: $2 Billion.');
eq(makeAd('business',{mode:'Selling',name:'Plantation',beds:'10',crop:'Cabbage'},c).text,'Selling 10-Bed Cabbage Plantation business. Price: Negotiable.');bad('business',{mode:'Trading',name:'ATM'},/not allowed/);bad('business',{mode:'Selling',name:'ATM',location:'Gang HQ'},/location/);
eq(makeAd('items',{mode:'Selling',items:[{name:'battery',quantity:1000,price:'1500',each:true}]},c).text,'Selling 1.000 batteries. Price: $1.500 each.');
eq(makeAd('items',{mode:'Selling',items:[{name:'grand gift',quantity:4,price:'350k',each:true},{name:'luminous stone',quantity:3,price:'100k',each:true}]},c).text,'Selling 4 grand gifts and 3 luminous stones. Price: $350.000 each and $100.000 each respectively.');
eq(makeAd('items',{mode:'Selling',items:[{name:'license plate',detail:'1ABC234',price:'500k'}]},c).text,'Selling license plate (1ABC234). Price: $500.000');
eq(makeAd('items',{mode:'Buying',items:[{name:'sim-cards',detail:'11-11-111 22-22-222'}]},c).text,'Buying sim-cards with numbers 11-11-111 and 22-22-222. Budget: Negotiable.');
bad('items',{mode:'Buying',items:[{name:'sim-cards',detail:'1111111'}]},/format/);bad('items',{mode:'Selling',items:[{name:'license plate',detail:'ABC',quantity:2}]},/one license/);bad('items',{mode:'Buying',items:[{name:'weed'}]},/not found/);bad('items',{mode:'Buying',items:Array(4).fill({name:'battery'})},/three/);
eq(makeAd('items',{mode:'Selling',items:[{name:'battery',price:'5k'}],market:'beach',marketNumber:'27',goodPrices:true},c).text,'Selling battery for good prices at beach market shop №27.');
eq(makeAd('clothing',{mode:'Selling',items:[{name:'Bendi T-shirt',color:'red',luminous:true,type:'2',gender:'for men'}]},c).text,'Selling red luminous Bendi T-shirt of type 2 for men. Price: Negotiable.');
eq(makeAd('clothing',{mode:'Selling',items:[{name:'AK-47 chain'}]},c).text,'Selling AK-47 chain. Price: Negotiable.');
const long=c.clothing.find(r=>r.name.length>45);bad('clothing',{mode:'Selling',items:Array(3).fill({name:long.name})},/limit is 150/);
let sweep=0;for(const category of ['vehicle','clothing','items'])for(const rec of c[category==='vehicle'?'vehicles':category]){const row={name:rec.name,variant:rec.variants?.[0]||(rec.variantKind==='version'?'1':''),detail:rec.name==='license plate'?'ABC123':rec.name==='sim-cards'?'11-11-111':''};const data=category==='vehicle'?{mode:'Selling',name:rec.name}:{mode:'Selling',items:[row]};const result=makeAd(category,data,c);assert(result.text.length<=150);assert(!/\/(?:s|es)|1\/2/.test(result.text));sweep++;}
console.log(JSON.stringify({checks:n,catalogueSweep:sweep,counts:{vehicles:c.vehicles.length,clothing:c.clothing.length,items:c.items.length},status:'passed'}));
eq(makeAd('items',{mode:'Selling',items:[{name:'neon armoured vest skin',variant:1,quantity:2}]},c).text,'Selling 2 neon armoured vest skins (V.1). Price: Negotiable.');
eq(makeAd('items',{mode:'Selling',items:[{name:'VIP 2',quantity:3}]},c).text,'Selling 3 VIPs 2. Price: Negotiable.');
eq(makeAd('business',{mode:'Selling',name:'Gas Station',location:'near airport'},c).text,'Selling Gas Station business near airport. Price: Negotiable.');
bad('property',{mode:'Selling',type:'house',count:2,numbers:'1'},/each advertised/);
for(const cat of ['clothing','items'])for(const rec of c[cat]){if(['sim-cards','license plate'].includes(rec.name))continue;makeAd(cat,{mode:'Selling',items:[{name:rec.name,quantity:2,variant:rec.variants?.[0]||(rec.variantKind==='version'?'1':'')}]},c);}
console.log('Plural catalogue sweep and edge cases passed.');
let combinations=0;
for(const mode of ['Buying','Selling','Trading','Selling or trading'])for(const kind of ['car','electric car','motorcycle','boat','plane','helicopter']){
 const label=mode==='Buying'?'Budget':'Price';const noun=kind==='electric car'?'an electric car':'a '+kind;
 eq(makeAd('vehicle',{mode,kind,name:''},c).text,`${mode} ${noun}.`+(mode==='Trading'?'':` ${label}: Negotiable.`));
 eq(makeAd('vehicle',{mode,kind,name:'   '},c).text,`${mode} ${noun}.`+(mode==='Trading'?'':` ${label}: Negotiable.`));
 combinations++;
}
eq(makeAd('vehicle',{mode:'Trading',kind:'car',targetKind:'helicopter'},c).text,'Trading a car for a helicopter.');
eq(makeAd('vehicle',{mode:'Selling or trading',kind:'boat',targetKind:'plane',price:'2m'},c).text,'Selling or trading a boat for a plane. Price: $2 Million.');
eq(makeAd('vehicle',{mode:'Selling',kind:'car',config:'full',extras:['drift kit','turbo kit','insurance','visual upgrades','tuning parts']},c).text,'Selling a car in full configuration with visual upgrades, insurance, tuning parts, turbo and drift kit. Price: Negotiable.');
bad('vehicle',{mode:'Selling',kind:'house'},/valid vehicle/);
bad('vehicle',{mode:'Trading',kind:'car',targetKind:'house'},/target type/);
bad('property',{mode:'Renting out',type:'family'},/cannot be rented/);
bad('property',{mode:'Looking to rent',type:'family'},/cannot be rented/);
bad('property',{mode:'Selling',type:'apartment',location:'in city'},/only allowed/);
bad('items',{mode:'Selling',items:[{name:'battery'}],market:'invalid'},/valid market/);
eq(makeAd('business',{mode:'Selling',name:'private business'},c).text,'Selling a private business. Price: Negotiable.');
eq(makeAd('items',{mode:'Buying',items:[{name:'license plate',special:true}]},c).text,'Buying a special license plate. Budget: Negotiable.');
eq(makeAd('items',{mode:'Selling',items:[{name:'sim-cards',detail:'11-11-111'}]},c).text,'Selling a sim-card with number 11-11-111. Price: Negotiable.');
for(const rec of c.vehicles)for(const mode of ['Buying','Selling','Trading','Selling or trading']){const result=makeAd('vehicle',{mode,name:rec.name},c);assert(result.count<=150);assert(result.text.includes('“'+rec.name+'”'));if(mode==='Trading')assert(!/Price:|Budget:/.test(result.text));}
console.log(JSON.stringify({genericVehicleCombinations:combinations,namedVehicleModeChecks:c.vehicles.length*4,totalExplicitChecks:n,status:'passed'}));
