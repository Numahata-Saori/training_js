const key = 'favorite-list';
let postsBox = [];

const postShow = document.getElementById('post-show');
const postContents = document.getElementById('post-contents');
const postFav = document.getElementsByClassName('fav-button');

const buttonTextConnecting = '接続中...'
const buttonTextGet = '投稿を取得'

async function fetchPosts() {
	if (!postShow && !postContents) return;

	try {
		changeBtnText(postShow, true, buttonTextConnecting);

		const response = await fetch('https://jsonplaceholder.typicode.com/posts');

		if (!response.ok) {
			throw new Error(`サーバーエラー：${response.status}`);
		}

		// jsonとして取得
		const json = await response.json();
		console.log(json); // 確認用

		// 取得結果をグローバル変数に代入
		postsBox = json;

		displayPosts(postsBox);
		changeBtnText(postShow, false, buttonTextGet);

		console.log('get success');
	} catch(error) {
		console.log(error.message);
	}
}

function changeBtnText(btn, disabled, text) {
	btn.disabled = disabled;
	btn.textContent = text;
}

function displayPosts(posts) {
	if (posts.length === 0) {
		postContents.innerHTML = '<p class="no-results">該当する投稿は見つかりませんでした。</p>';
		console.log('no posts');
		return;
	}

	const isfav = getSaved();

	// posts.forEach(post => { ... } からmapに置き換え
	const postContentsInner = posts.map(post => {
		const favConf = isfav.includes(post.id.toString());
		const favButtonText = favConf ? 'お気に入り登録済み' : 'お気に入り';
		const favButtonClass = favConf ? 'fav-button active' : 'fav-button';

		return `
			<li class="post-item">
				<h3 class="post-title">${ escapeHTML(post.title) }</h3>
				<p class="post-body">${ escapeHTML(post.body) }</p>
				<button class="${ favButtonClass }" data-id="${ post.id }">${ favButtonText }</button>
			</li>
		`
	});

	postContents.innerHTML = `<ul class="post-list">${ postContentsInner.join('') }</ul>`
}

/**
 * HTMLエスケープ
 * @param {*} str 
 * @returns 
 */
function escapeHTML(str) {
	return str
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;');
}

function getSaved() {
	// localStorageに保存されているデータを取得
	const favGet = localStorage.getItem(key);
	// jsonを文字列に変換し、配列に戻す
	return favGet ? JSON.parse(favGet) : [];
}

postShow.addEventListener('click', () => {
	fetchPosts();
});

postContents.addEventListener('click', (e) => {
	if (e.target.classList.contains('fav-button')) {
		const postGetId = e.target.dataset.id.toString();
		console.log('記事ID：', postGetId); // 確認用

		// localStorageのIDを取得
		let favGetSaved = getSaved();

		// localStorageの配列の中からincludesで条件にあうIDをチェック
		if (favGetSaved.includes(postGetId)) {
			// 取得したIDを除外し、localStorageに上書き
			favGetSaved = favGetSaved.filter(id => id !== postGetId);
			console.log(`記事ID：${ postGetId } 削除`);
		} else {
			// localStorageに追加
			favGetSaved.push(postGetId);
			console.log(`記事ID：${ postGetId } 追加`);
		}

		// 文字列をjsonに変換し、localStorageに保存
		localStorage.setItem(key, JSON.stringify(favGetSaved));

		displayPosts(postsBox);
	} else {
		return;
	}
});