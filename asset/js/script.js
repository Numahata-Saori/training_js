


/**
 * while
 */


// let i = 0;
// while (i < 5) {
//   console.log(i);
//   i++;
// }

// console.log('---')

// while (i < 3) {
//   i++;
// }
// console.log(i);

// while ( true ) {
//   if ( i > 3 ) {
//     break; // iが3より大きい場合に中断
//   }
// }




/**
 * for
 */

// for (let i = 0; i < 5; i++) {
// 	console.log(i);
// }

// 5.7 練習問題
console.log('--5.7--')
for (let i = 0; i < 10; i +=3) {
	console.log(i);
}

// function countSelected(obj) {
// 	let num = 0;
// 	for (let i = 0; i < obj.options.length; i++) {
// 		if (obj.ooptions[i].selected) {
// 			num++;
// 		}
// 	}
// 	return num;
// }

// const countBtn = document.getElementById('count-btn');

// countBtn.addEventListener('click', () => {
// 	const musicTypes = document.selectForm.musicTypes;
// 	console.log(`You have selected ${ counSelected(musicTypes) } option(s).`);
// });

// const fruits = {
//   apple: 'りんご',
//   banana: 'バナナ',
//   orange: 'オレンジ'
// };
// for ( const key in fruits ) {
//   console.log(`キー[${key}] 値:[${fruits[key]}]`);
// }

// 5.8 練習問題
console.log('--5.8--')
const arry = [ 10, 20, 23, 47 ]
let sum58 = 0;
for ( let i = 0; i < arry.length; i++ ) {
  sum58 += arry[i];
}
console.log(sum58);

// 5.9 練習問題
console.log('--5.9--')
const obj = {
  prop1: 10,
  prop2: 20,
  skip: 20,
  prop3: 23,
  prop4: 47,
}
let sum59 = 0;
for ( const key in obj ) {
  if ( key !== 'skip') {
    sum59 += obj[key];
  }
}
console.log(sum59);


/**
 * forEach
 */

// forEachでインデックス（何番目か）を取得する
// array.forEach((value, index, array) => { ... });
// const fruits = ['りんご', 'バナナ', 'みかん'];

// fruits.forEach((fruit, index) => {
//   console.log(`インデックス ${index}: ${fruit}`);
// });

// const nums = [100, 200]
// nums.forEach((a, b) => {
//   if (b === 0) console.log'(a);
// });