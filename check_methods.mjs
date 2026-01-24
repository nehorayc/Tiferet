import { Zmanim } from '@hebcal/core';
const methods = Object.getOwnPropertyNames(Zmanim.prototype);
console.log('--- START METHODS ---');
methods.forEach(m => console.log(m));
console.log('--- END METHODS ---');
