const key = 'favorite-list';
const state = {
	allPosts: [],
	favorites: [],
	searchKeyword: ''
};

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
		state.allPosts = json;
		state.favorites = getSaved();

		render();
		// displayPosts(state.allPosts, '');
		changeBtnText(postShow, false, buttonTextGet);

		console.log('get success');
	} catch(error) {
		console.log(error.message);
	}
}

/**
 * ボタンテキストを変更
 * @param {*} btn ボタン
 * @param {*} disabled 無効/有効切り替え
 * @param {*} text ボタンテキスト
 */
function changeBtnText(btn, disabled, text) {
	btn.disabled = disabled;
	btn.textContent = text;
}

/**
 * 取得した投稿を表示
 * @param {*} posts 投稿情報
 * @param {*} keyword 検索キーワード
 * @returns 
 */
function displayPosts(posts, keyword = '') {
	if (posts.length === 0) {
		postContents.innerHTML = '<p class="no-results">該当する投稿は見つかりませんでした。</p>';
		console.log('no posts');
		return;
	}

	// localStorageのIDを取得
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
 * @param {*} text 投稿情報
 * @param {*} keyword 検索キーワード
 * @returns 
 */
function highlightText(text, keyword) {
	if (!keyword) return text;

	const escapedKeyword = keyword.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
	const regex = new RegExp(`(${ escapedKeyword })`, 'gi');
	return text.replace(regex, '<mark>$1</mark>');
}

/**
 * キーワードを検索
 * @param {*} posts 投稿情報
 * @param {*} keyword 検索キーワード
 * @returns 
 */
function getFilteredPosts(posts, keyword) {
	const lowKey = keyword.toLowerCase();
	return posts.filter(p => {
		return p.title.toLowerCase().includes(lowKey) || p.body.toLowerCase().includes(lowKey);
	});
}

/**
 * 画面に取得した投稿情報を表示
 */
function render() {
	const filtered = getFilteredPosts(state.allPosts, state.searchKeyword);
	displayPosts(filtered, state.searchKeyword);
}

/**
 * お気に入り情報をlocalStorageに追加、削除
 * @param {*} postId 投稿ID
 */
function toggleFavorite(postId) {
	// localStorageの配列の中からincludesで条件にあうIDをチェック
	if (state.favorites.includes(postId)) {
		// 取得したIDを除外し、localStorageに上書き
		state.favorites = state.favorites.filter(id => id !== postId);
	} else {
		// localStorageに追加
		state.favorites.push(postId);
	}

	// 文字列をjsonに変換し、localStorageに保存
	localStorage.setItem(key, JSON.stringify(state.favorites));
	render();
}

postShow.addEventListener('click', () => {
	fetchPosts();
});

postContents.addEventListener('click', (e) => {
	if (e.target.classList.contains('fav-button')) {
		const postGetId = e.target.dataset.id.toString();
		console.log('記事ID：', postGetId); // 確認用

		toggleFavorite(postGetId);

	} else {
		return;
	}
});

postSearch.addEventListener('input', (e) => {
	state.searchKeyword = e.target.value.trim().toLowerCase();
	console.log(state.searchKeyword);

	render();
});