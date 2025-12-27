// 13.1 非同期処理とは
// // スレッド / 動機処理と非同期処理
// function sleep(ms) {
// 	// スレッド
// 	// const startTime = new Date();
// 	// while (new Date() - startTime < ms);
// 	// alert('sleep関数が完了しました');

// 	// 非同期処理
// 	setTimeout(() => {
// 		alert('sleep関数が完了しました');
// 	}, ms);
// }

// sleep(3000);

// // ⇒promiseなら
// function sleep(ms) {
// 	return new Promise((resolve) => {
// 		setTimeout(() => {
// 			resolve();
// 		}, ms);
// 	});
// }

// // ⇒asyncなら
// async function run() {
// 	console.log('3秒待ちます...')
// 	await sleep(300);
// 	alert('sleep関数が完了しました');
// 	console.log('完了');
// }
// run();

// // const btn = document.querySelector('button');
// const btn1 = document.getElementById('btn1');
// function clickHandler() {
// 	alert('ボタンがクリックされました');
// }
// btn1.addEventListener('click', clickHandler);

// let val = 0;
// setTimeout(() => {
// 	val = 1;
// }, 1000);
// console.log(val);

// 13.1.5 非同期処理のハンドリング
// // 非同期処理内で変更した値が取得できない
// let val = -1;
// // function timer() {
// // 	setTimeout(() => {
// // 		val = Math.floor(Math.random() * 11);
// // 	}, 1000);
// // }
// // timer();
// // console.log(val);

// // コールバック関数を使った非同期処理のハンドリング
// function timer(callback) {
// 	setTimeout(() => {
// 		val = Math.floor(Math.random() * 11);
// 		callback(val);
// 	}, 1000);
// }
// function operations(val) {
// 	console.log(val);
// }
// timer(operations);

// 13.2 練習問題
function delay(fn, message, ms) {
	setTimeout(() => {
		fn(message);
	},ms);
}
// delay(console.log, 'こんにちは', 1000);
// // console.log('こんにちは');
// delay(alert, 'さようなら', 2000);
// delay(function(message1){
// 	console.log(message1);

// 	delay(function(message2){
// 		console.log(message2);
// 	}, 'さらに1秒経ちました', 1000);
// }, '1秒経ちました', 1000);


// 13.2 Promise
// Promise
// let prom = new Promise();
// let thenProm = prom.then();
// let catchProm = thenProm.catch();
// let finallyProm = catchProm.finally();

// Promiseインスタンス化
// const instance = new Promise(asyncHandler);
// function asyncHandler(resolve, reject) {
// 	setTimeout(() => {
// 		if() {
// 			// 非同期処理が成功したとき
// 			resolve(data);
// 		} else {
// 			// 非同期処理が失敗したとき
// 			reject(error);
// 		}
// 	});
// }

// thenメソッド
// let thenProm = prom.then(successHandler);
// function successHandler(data) {
// 	// 非同期処理が成功した後に実行したい処理
// }

// catchメソッド
// let catchProm = prom.catch(errorHandler);
// function errorHandler(error) {
// 	// 非同期処理が失敗した後に実行したい処理
// }

// finallyメソッド
// let finallyProm = prom.finally(finalHandler);
// function finalHandler() {
// 	// 非同期処理が完了した後に必ず実行したい処理
// }


// Promiseによる非同期処理
// let instance = new Promise((resolve, reject) => {
// 	setTimeout(() => {
// 		const rand = Math.floor(Math.random() * 11);
// 		if(rand < 5) {
// 			reject(rand)
// 		} else {
// 			resolve(rand);
// 		}
// 	}, 1000);
// });

// instance = instance.then(val => {
// 	console.log(`5以上の値[${ val }]が渡ってきました`);
// });

// instance = instance.catch(errorVal => {
// 	console.log(`5未満の値[${ errorVal }]が渡ってきたためエラー表示`);
// });

// instance = instance.finally(() => {
// 	console.log('処理を終了します');
// });

// 13.3 練習問題
// new Promise((resolve, reject) => {
// 	setTimeout(() => {
// 		const date = new Date();
// 		const second = date.getSeconds();

// 		if(second % 2 === 0) {
// 			// 偶数なら成功
// 			resolve(second);
// 		} else {
// 			// 奇数なら失敗
// 			reject(second);
// 		}
// 	},1000);
// }).then(second => {
// 	// resolveの時
// 	console.log(`[${ second }]は偶数のため、成功とします`);
// }).catch(second => {
// 	// rejectの時
// 	console.log(`[${ second }]は奇数のため、エラーとします`);
// }).finally(() => {
// 	console.log('処理を終了します');
// })

// Promiseチェーン
// let count = 0
// // function promiseFactory(count) {
// // 	return new Promise((resolve, reject) => {
// // 		setTimeout(() => {
// // 			count++;
// // 			console.log(`${ count }回目のコールです<br>時刻：[${ new Date().toTimeString() }]`);
// // 			if (count === 3) {
// // 				reject(count);
// // 			} else {
// // 				resolve(count);
// // 			}
// // 		}, 1000);
// // 	});
// // }
// function promiseFactory() {
// 	return new Promise((resolve, reject) => {
// 		setTimeout(() => {
// 			count++;
// 			console.log(`${ count }回目のコールです<br>時刻：[${ new Date().toTimeString() }]`);
// 			if (count === 3) {
// 				reject(count);
// 			} else {
// 				resolve(count);
// 			}
// 		}, 1000);
// 	});
// }

// const instance = promiseFactory();

// instance
// .then(() => { return instance; })
// .then(() => { return instance; })
// .then(() => { return instance; })

// promiseFactory()
// .then(() => { return promiseFactory(); })
// .then(() => { return promiseFactory(); })
// .then(() => { return promiseFactory(); })

// // promiseFactory(0)
// // .then(count => { return promiseFactory(count); })
// // .then(count => { return promiseFactory(count); })
// // .then(count => { return promiseFactory(count); })
// // .then(count => { return promiseFactory(count); })
// .catch(errorCount => {
// 	console.log(`エラーに飛びました<br>現在のカウントは${ errorCount }です`);
// }).finally(() => {
// 	console.log('処理を終了します');
// });

// 13.4 練習問題
// function promiseFactory(count) {
// 	return new Promise((resolve) => {
// 		setTimeout(() => {
// 			console.log(count);
// 			count += 2;
// 			resolve(count);
// 		}, 1000);
// 	});
// }
// promiseFactory(0)
// .then(count => { return promiseFactory(count); })
// .then(count => { return promiseFactory(count); })
// .then(count => { return promiseFactory(count); })

// Promise.all
// Promise.all(iterablePromises)
// .then((resolvedArray) => {

// }).catch((error) => {

// })

// function wait(ms) {
// 	return new Promise((resolve, reject) => {
// 		setTimeout(() => {
// 			console.log(`${ ms }msの処理が完了しました`);
// 			resolve(ms);
// 		}, ms);
// 	});
// }

// const wait400 = wait(400);
// const wait500 = wait(500);
// const wait600 = wait(600);
// Promise.all([wait500, wait600, wait400])
// .then(([resolve500, resolve600, resolve400]) => {
// 	console.log('すべてのPromiseが完了しました');
// 	console.log(resolve500, resolve600, resolve400);
// });
