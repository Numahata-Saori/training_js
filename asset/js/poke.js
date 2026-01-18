const POKE_BASE_URL = 'https://pokeapi.co/api/v2/';
const POKE_STORAGE_KEY = 'poke-favorite-list';

let allPokesList = [];
let pokeFavsList = [];
const pokeLimit = 25;
let currentOffsetPoke = 0;

const pokeContents = document.getElementById('pokeContents');
const pokeMoreButton = document.getElementById('pokeMoreButton');
const pokeSearchInput = document.getElementById('pokeSearchInput');
const pokeFavoritesSection = document.getElementById('pokeFavoritesSection');
const pokeFavoritesContents = document.getElementById('pokeFavoritesContents');

window.addEventListener('DOMContentLoaded', () => {
  // localStorageからお気に入りを取得
  const saved = localStorage.getItem(POKE_STORAGE_KEY);

  // 保存データがあれば、お気に入りリストに入れる
  if (saved) {
    try {
      pokeFavsList = JSON.parse(saved);
      console.log('localStrageを取得しました', pokeFavsList);
      renderFavoritesPokes();
    } catch(error) {
      pokeFavsList = [];
      console.error('保存データの読み込みに失敗しました', error);
    }
  } else {
    renderFavoritesPokes();
  }
  fetchMorePokes();
});

async function fetchMorePokes() {
  // console.log(pokeLimit);
  try {
     if (pokeMoreButton) pokeMoreButton.disabled = true; // 無効

    const resPoke = await fetch(`${ POKE_BASE_URL }pokemon?limit=${pokeLimit}&offset=${ currentOffsetPoke }`);
    if (!resPoke.ok) throw new Error('サーバーエラーが発生');
    const dataPoke = await resPoke.json();
    // console.log(dataPoke);

    // ポケモン図鑑のデータを取得
    const newItemsPoke = await Promise.all(dataPoke.results.map(async (poke) => {
      try {
        // IDを取得
        // URLから'/'で分割、filter(Boolean)で審議配列を作り、pop()で配列の最後の要素を取り出す
        const pokeId = poke.url.split('/').filter(Boolean).pop();
        const resPokeDetail = await fetch(`${ POKE_BASE_URL }pokemon/${pokeId}`);
        const resPokeSpecies = await fetch(`${ POKE_BASE_URL }pokemon-species/${pokeId}`);
        const dataPokeDetail = await resPokeDetail.json();
        const dataPokeSpecies = await resPokeSpecies.json();

        // ポケモン日本語名を取得
        // 三項演算子 ? : ⇒ オプショナルチェイニング ?.
        // Optional chaining
        // 条件（日本語名を探す）があれば取得、なければnameは空なのでエラーは出さずに poke.name の英語名を取得
        const nameJa = dataPokeSpecies.names.find(n => n.language.name === 'ja-Hrkt' || n.language.name === 'ja')?.name || poke.name;

        // ポケモン画像を取得
        const imageArtwork = dataPokeDetail.sprites.other['official-artwork'].front_default;
        const imageFront = dataPokeDetail.sprites.front_default;

        return {
          id: parseInt(pokeId), // 数値を返す
          nameEn: poke.name,
          nameJa: nameJa,
          image: imageArtwork,
          imageFront: imageFront
        };
      } catch (e) {
        console.warn(`個別の取得に失敗: ${p.name}`, e);
        return null;
      }
    }));

    // nullを除去
    const filteredNew = newItemsPoke.filter(item => item !== null);
    // 取得したデータを配列に入れる、今取得しているallPokesListのポケモンは残して、新たにnewItemsPokeに取得したポケモンを追加し上書き
    // スプレッド構文 ...
    allPokesList = [...allPokesList, ...filteredNew];
    // 初回：0ページから25匹取得、もっと見るボタン：25ページから25匹取得
    currentOffsetPoke += pokeLimit;

    // データを描画
    filterRenderPokes();
    // renderPokes(allPokesList);

    console.log('ポケモンの取得が完了しました');
  } catch (error) {
    // console.error('ポケモンの取得に失敗しました');
    console.error("fetchMorePokes 内でエラーが発生:", error);
  } finally {
    if (pokeMoreButton) pokeMoreButton.disabled = false; // 有効
  }
}


/**
 * キーワードからポケモン図鑑を検索
 */
function filterRenderPokes() {
  // 検索窓に入力された値を小文字に変換
  const query = pokeSearchInput.value.toLowerCase().trim();
  console.log('検索語句: ', query);
  // allPokesListが空の場合、何もしない
  if (!allPokesList || allPokesList.length === 0) return;

  // 検索キーワードがなければ図鑑を全て表示、あれば該当するものだけ表示
  if (!query) {
    renderPokes(allPokesList);
    return;
  } else {
    const filtered = allPokesList.filter(poke => {
      // 検索キーワードがあった場合、名前（日本語・英語）にその文字が含まれているかどうか確認
      return poke.nameJa.includes(query) || poke.nameEn.toLowerCase().includes(query);
    });
    renderPokes(filtered);
  }
}

/**
 * ポケモン図鑑を表示
 * @param {*} list
 */
function renderPokes(list) {
  if (!pokeContents) return;

  // データを受け取ったかどうか確認
  if (!list || !Array.isArray(list)) {
    console.warn("renderPokes に配列が渡されませんでした");
    return;
  }

  // 空の場合
  if (list.length === 0) {
    pokeContents.innerHTML = '<p class="poke-app__error">見つかりませんでした</p>';
    console.log('データが見つかりませんでした');
    return;
  }

  pokeContents.innerHTML = ''; // 空にする

  let htmlContent = '<ul class="poke-app__list">';
  list.forEach(poke => {
    const isFav = pokeFavsList.some(fav => fav.id === poke.id);
    const activeClass = isFav ? 'active' : '';
    const iconClass = isFav ? 'mdi-heart' : 'mdi-heart-outline';

    htmlContent += `
      <li class="poke-app__item">
        <p class="poke-app__number">No. ${ String(poke.id).padStart(3, '0') }</p>
        <button onclick="toggleFavorite(${ poke.id })" class="heart-btn ${ activeClass }"><span class="mdi ${iconClass} heart-icon"></span></button>
        <p class="poke-app__name">${ poke.nameJa }<span>(${ poke.nameEn })</span></p>
        <div class="poke-app__image"><img src="${ poke.image }" alt="${ poke.nameJa }"></div>
        <button id="pokeDetailButton">詳細を見る</button>
      </li>
    `;
  });
  htmlContent += '</ul>';

  pokeContents.innerHTML = htmlContent;
}

/**
 * お気に入りリストを表示
 * @returns
 */
function renderFavoritesPokes() {
  console.log('renderFavoritesPokes を起動');
  if (!pokeFavoritesContents) return;

  // お気に入りリストが0の場合、sectionごと非表示
  if (pokeFavsList.length === 0) {
    pokeFavoritesSection.classList.add('hidden');
    console.log('お気に入りリストが空のため非表示');
    return;
  }

  // お気に入りリストを表示させる
  pokeFavoritesSection.classList.remove('hidden');

  pokeFavoritesContents.innerHTML = ''; // 空にする
  // console.log( pokeFavoritesContents.innerHTML);

  let htmlContentFav = '<ul class="poke-fav__list">';
  pokeFavsList.forEach(fav => {
    htmlContentFav += `
      <li class="poke-fav__item">
        <p class="poke-fav__image"><img src="${ fav.image }" alt="${ fav.nameJa }"></p>
      </li>
    `;
  });
  htmlContentFav += '</ul>';

  pokeFavoritesContents.innerHTML = htmlContentFav;
  console.log('お気に入りリストを表示しました');
}

/**
 * お気に入りを保存、更新
 * @param {*} id
 */
window.toggleFavorite = function(id) {
  // 引数のIDがpokeFavsListの配列の中にIDがあるか、一致したら何番目にあるか返す
  const favoriteIndex = pokeFavsList.findIndex(fav => fav.id === id);
  // リストに一致するIDがなければ-1 ⇒ push、見つかれば0 ⇒ spliceで削除
  if (favoriteIndex === -1) {
    // allPokesListの全情報からIDで一致した情報を返す
    const poke = allPokesList.find(p => p.id === id);
    if (poke) pokeFavsList.push(poke);
    console.log('お気に入りに保存しました');
  } else {
    // favoriteIndex番目の要素を取り除く
    pokeFavsList.splice(favoriteIndex, 1);
    console.log('お気に入りから削除しました');
  }

  // localStorageを更新、配列をJSONに置き換え
  localStorage.setItem(POKE_STORAGE_KEY, JSON.stringify(pokeFavsList));

  renderFavoritesPokes();
  filterRenderPokes();
}

if (pokeMoreButton) pokeMoreButton.addEventListener('click', fetchMorePokes);
if (pokeSearchInput) pokeSearchInput.addEventListener('input', filterRenderPokes);