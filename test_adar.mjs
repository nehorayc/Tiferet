import { HDate } from '@hebcal/core';

const d1 = new HDate(15, 12, 5785); // Regular Adar
console.log('5785 (Regular):', d1.getMonthName('h'));

const d2 = new HDate(15, 12, 5784); // Adar I
console.log('5784 (Adar I):', d2.getMonthName('h'));

const d3 = new HDate(15, 13, 5784); // Adar II
console.log('5784 (Adar II):', d3.getMonthName('h'));
