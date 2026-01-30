import { HDate, Locale } from '@hebcal/core';

const d1 = new HDate(15, 12, 5785); // Regular Adar
const name1 = d1.getMonthName();
console.log('5785 (Regular):', name1, '->', Locale.gettext(name1, 'he'));

const d2 = new HDate(15, 12, 5784); // Adar I
const name2 = d2.getMonthName();
console.log('5784 (Adar I):', name2, '->', Locale.gettext(name2, 'he'));

const d3 = new HDate(15, 13, 5784); // Adar II
const name3 = d3.getMonthName();
console.log('5784 (Adar II):', name3, '->', Locale.gettext(name3, 'he'));
