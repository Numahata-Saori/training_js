// // 非同期関数の宣言
// async function asyncFunction() {
// 	return 'hello';
// }

// asyncFunction().then((returnVal) => {
// 	console.log(returnVal);
// });


// // awaitはresolveの値を取り出す
// const prom = new Promise(resolve => {
// 	setTimeout(() => resolve('この値を取り出します'), 1000)
// });

// async function asyncFunction() {
// 	const val = await prom;
// 	console.log(val);
// }

// asyncFunction();

// // Promiseがrejectedになった場合
// async function throwError() {
// 	try {
// 		await Promise.reject('Promiseが失敗しました');
// 	} catch(error) {
// 		console.log(error);
// 	}
// }

// throwError();

// fetch()


/**
 * 犬の画像を取得
 */
// async functionで非同期関数を定義
async function getImgFunction() {
	const btn = document.getElementById('dogbtn');
	const container = document.getElementById('dogcontainer');

	try {
		// 連打防止：通信開始時にボタンを無効化
		btn.disabled = true;
		btn.textContent = '読み込み中...';

		// const response = await fetch('./asset/image/sample.jpeg');
		const response = await fetch('https://dog.ceo/api/breeds/image/random');

		if (!response.ok) throw new Error('画像が見つかりません');
		// console.log(response);

		// responseオブジェクトからバイナリデータとして読み込む
		// const blob = await response.blob();

		// jsonデータとして読み込む
		const res = await response.json();
		const imgUrl = res.message;
		// console.log(imgUrl);

		// img要素を生成
		const img = document.createElement('img');
		// img.src = URL.createObjectURL(blob);
		img.src = imgUrl;
		// console.log(img.src);
		
		img.style.width = '300px';
		img.style.display = 'block';

		// 中身を空にしてから、画像を追加
		container.innerHTML = '';
		container.appendChild(img);

		console.log('成功', img.src);
	} catch(error) {
		alert('エラー：' + error.message);
		console.error('エラーが発生しました', error);
	} finally {
		// 通信終了時にボタンを元に戻す
		btn.disabled = false;
		btn.textContent = '犬を見る';
	}
}

const dogBtn = document.getElementById('dogbtn');
dogBtn.addEventListener('click', getImgFunction)



const STORAGE_KEY = 'favorite'
let allPosts = [];

const postBtn = document.getElementById('postbtn');
const container = document.getElementById('post-container');
const searchInput = document.getElementById('search-input');
const resetBtn = document.getElementById('reset-btn');
const favBtn = document.getElementsByClassName('fav-btn');


/**
 * 投稿一覧を取得
 * @returns 
 */
async function fetchPosts() {
	const btn = postBtn;
	if (!btn || !container) return;

	try {
		btn.disabled = true;
		btn.textContent = '読み込み中...';

		const response = await fetch('https://jsonplaceholder.typicode.com/posts');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const res = await response.json();

		console.log(res);
		// console.log(`取得件数：${ res.length }件`);

		// 取得結果をグローバル変数に入れる
		allPosts = res;

		displayPosts(allPosts, '');

		// // container.innerHTML = '';

		// // const postList = document.createElement('ul');
		// // container.appendChild(postList)
		// let htmlContent = '<ul class="post-list">';

		// data.forEach(post => {
		// 	// const postItem = document.createElement('li');
		// 	// postItem.className = 'post-item'
		// 	// postList.appendChild(postItem)

		// 	// const titleEL = document.createElement('h3');
		// 	// titleEL.className = 'post-title';
		// 	// titleEL.textContent = post.title;
		// 	// postItem.appendChild(titleEL)

		// 	// const bodyEL = document.createElement('p');
		// 	// bodyEL.className = 'post-body';
		// 	// bodyEL.textContent = post.body;
		// 	// postItem.appendChild(bodyEL);

		// 	htmlContent += `
		// 		<li class="post-item">
		// 			<h3 class="post-title">${escapeHTML(post.title)}</h3>
		// 			<p class="post-body">${escapeHTML(post.body)}</p>
		// 		</li>
		// 	`;
		// });

		// htmlContent += '</ul>';

		// container.innerHTML = htmlContent;
		
	} catch(error) {
		console.error('Data fetch failed:', error);
		alert('エラーが発生しました。時間を置いて再度お試しください。');
	} finally {
		btn.disabled = false;
		btn.textContent = '投稿を見る';
	}
}

/**
 * localStorageに保存した値を取得し、配列に戻ず
 * @returns 
 */
function getSavedFavs() {
	// 現在の配列を取り出す
	const getFav = localStorage.getItem(STORAGE_KEY);
	// 文字列を配列に戻す
	return getFav ? JSON.parse(getFav) : [];
}

/**
 * 取得した投稿内容を表示
 * @param {*} posts 
 */
function displayPosts(posts, keyword = '') {
	if (!container) return;

	console.log('displayPosts:', keyword);

	if (posts.length === 0) {
		container.innerHTML = '<p class="no-results">該当する投稿は見つかりませんでした。</p>';
		return;
	}

	// localStorage.getItemはforEachの外で実行、動作が重くなる
	const favList = getSavedFavs();

	let htmlContent = '<ul class="post-list">';
	posts.forEach(post => {
		let title = escapeHTML(post.title);
		let body = escapeHTML(post.body);

		if (keyword) {
			title = highlightText(title, keyword);
			body = highlightText(body, keyword);
		}

		const isFav = favList.includes(post.id.toString()); // 数値型
		const favBtnText = isFav ? 'お気に入り登録済み' : 'お気に入り';
		const favBtnClass = isFav ? 'fav-btn active' : 'fav-btn';

		htmlContent += `
			<li class="post-item">
				<h3 class="post-title">${ title }</h3>
				<p class="post-body">${ body }</p>
				<button class="${ favBtnClass }" data-id="${ post.id }">${ favBtnText }</button>
			</li>
		`;
	});
	htmlContent += '</ul>';

	container.innerHTML = htmlContent;
}

/**
 * 検索文字をハイライト
 * @param {*} text 
 * @param {*} keyword 
 * @returns 
 */
function highlightText(text, keyword) {
	if (!keyword) return text; // 検索語がなければそのまま返す

	// 正規表現を作成（g: 全て置換, i: 大文字小文字を無視）
	const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	// RegExpで検索文字と正規表現を照合
	const regex = new RegExp(`(${escapedKeyword})`, 'gi');
	// $1 はマッチした元の文字を保持
	return text.replace(regex, '<mark>$1</mark>');
}

/**
 * セキュリティ XSS対策
 * @param {*} str 
 * @returns 
 */
function escapeHTML(str) {
	return str
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#039;');
}

// inputイベントで1文字打つたびに検索が走る
// (e)はeventの略、発生したイベントに対してデータが入ったオブジェクトを自動的に作成して関数に渡す
searchInput.addEventListener('input', (e) => {
	const keyword = e.target.value.trim(); // trimで前後の空白を削除
	const searchKeyword = keyword.toLowerCase(); // 入力された文字（小文字に統一）

	// 検索文字が含まれている箇所を抽出
	const filteredPosts = allPosts.filter(post => {
		// キーワードが含まれているかチェック
		// return post.title.toLowerCase().includes(keyword);
		const isTitleMatch = post.title.toLowerCase().includes(searchKeyword);
    const isBodyMatch = post.body.toLowerCase().includes(searchKeyword);
		return isTitleMatch || isBodyMatch;
	});

	displayPosts(filteredPosts, keyword);
});

// resetボタン
resetBtn.addEventListener('click', () => {
	// 検索窓を空にする
	searchInput.value = '';
	// 全件表示の戻す
	displayPosts(allPosts);
	// 入力欄にフォーカスを戻す
	searchInput.focus();
});

// 投稿表示ボタン
postBtn.addEventListener('click', () => {
	fetchPosts();
});

// お気に入り追加削除機能
container.addEventListener('click', (e) => {
	if (!e.target.classList.contains('fav-btn')) return;

	const getPostId = e.target.dataset.id.toString(); // 型を統一
	console.log('ID:', getPostId);

	let favList = getSavedFavs();
	console.log('お気に入りリスト：', favList);

	// 配列の中からincludesで条件に合うものをチェック
	if (favList.includes(getPostId)) {
		// 取得したIDを除外した新しいIDで配列を上書き
		favList = favList.filter(id => id !== getPostId);
		console.log(`ID:${getPostId} を削除`);
	} else {
		// 配列に新しいIDを保存
		favList.push(getPostId);
		console.log(`ID:${getPostId} を追加`);
	}

	// 配列を文字列にして保存
	localStorage.setItem(STORAGE_KEY, JSON.stringify(favList));

	const currentKeyword = searchInput.value.trim();

	const filteredPosts = allPosts.filter(post => {
		const searchKeyword = currentKeyword.toLowerCase();
		return post.title.toLowerCase().includes(searchKeyword) || post.body.toLowerCase().includes(searchKeyword);
	});

	displayPosts(filteredPosts, currentKeyword);
});

