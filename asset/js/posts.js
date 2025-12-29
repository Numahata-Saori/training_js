const key = 'favorite-list';
let postsBox = [];

const postShow = document.getElementById('post-show');
const postContents = document.getElementById('post-contents');
const postFav = document.getElementsByClassName('fav-button');
const postSearch = document.getElementById('post-search');

const buttonTextConnecting = '接続中...'
const buttonTextGet = '投稿を取得'

/**
 * API URLから投稿記事データを取得
 * @returns 
 */
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

		displayPosts(postsBox, '');
		changeBtnText(postShow, false, buttonTextGet);

		console.log('get success');
	} catch(error) {
		console.log(error.message);
	}
}

/**
 * ボタンテキストを変更
 * @param {*} btn 
 * @param {*} disabled 
 * @param {*} text 
 */
function changeBtnText(btn, disabled, text) {
	btn.disabled = disabled;
	btn.textContent = text;
}

/**
 * 取得した投稿を表示
 * @param {*} posts 
 * @param {*} keyword 
 * @returns 
 */
function displayPosts(posts, keyword = '') {
	if (posts.length === 0) {
		postContents.innerHTML = '<p class="no-results">該当する投稿は見つかりませんでした。</p>';
		console.log('no posts');
		return;
	}

	const isfav = getSaved();

	// posts.forEach(post => { ... } からmapに置き換え
	const postContentsInner = posts.map(post => {
		let title = escapeHTML(post.title);
		let body = escapeHTML(post.body);
		const favConf = isfav.includes(post.id.toString());
		const favButtonText = favConf ? 'お気に入り登録済み' : 'お気に入り';
		const favButtonClass = favConf ? 'fav-button active' : 'fav-button';

		if (keyword) {
			title = highlightText(escapeHTML(post.title), keyword);
			body = highlightText(escapeHTML(post.body), keyword);
		}

		return `
			<li class="post-item">
				<h3 class="post-title">${ title }</h3>
				<p class="post-body">${ body }</p>
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

/**
 * localStorageにあるデータを取得
 * @returns 
 */
function getSaved() {
	// localStorageに保存されているデータを取得
	const favGet = localStorage.getItem(key);
	// jsonを文字列に変換し、配列に戻す
	return favGet ? JSON.parse(favGet) : [];
}

// https://www.bugbugnow.net/2020/02/Escape-characters-used-in-regular-expressions.html
// https://minerva.mamansoft.net/Notes/JavaScript%E3%81%A7%E6%AD%A3%E8%A6%8F%E8%A1%A8%E7%8F%BE%E6%96%87%E5%AD%97%E5%88%97%E3%82%92%E3%82%A8%E3%82%B9%E3%82%B1%E3%83%BC%E3%83%97
/**
 * 検索語句をハイライト
 * @param {*} text 
 * @param {*} keyword 
 * @returns 
 */
function highlightText(text, keyword) {
	if (!keyword) return text;

	const escapedKeyword = keyword.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
	const regex = new RegExp(`(${ escapedKeyword })`, 'gi');
	return text.replace(regex, '<mark>$1</mark>');
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

		const currentKeyword = postSearch.value.trim();
		const filteredPosts = postsBox.filter(post => {
			return post.title.toLowerCase().includes(currentKeyword.toLowerCase()) || post.body.toLowerCase().includes(currentKeyword.toLowerCase());
		});

		displayPosts(filteredPosts, currentKeyword);
	} else {
		return;
	}
});

postSearch.addEventListener('input', (e) => {
	const keyword = e.target.value.trim().toLowerCase();
	console.log(keyword);

	const searchPosts = postsBox.filter(post => {
		return post.title.toLowerCase().includes(keyword) || post.body.toLowerCase().includes(keyword);
	});

	displayPosts(searchPosts, keyword);
});