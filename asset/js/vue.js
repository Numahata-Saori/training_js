// 古い書き方
// Vue.createApp({
//   data: function () {
//     return {
//       message: 'Hello Vue!'
//     };
//   }
// }).mount('#app');



// const { createApp, ref, onMounted, computed, watch, Teleport } = Vue

/**
 * 犬の画像を取得する関数
 */
// Composition API
// createApp({
//   setup() {
//     const message = ref('Hello vue!');

//     const dogUrl = ref('');
//     const isDogLoading = ref(false);
//     const dogError = ref(null);


//     const fetchDog = async () => {
//       dogError.value = null;
//       isDogLoading.value = true;

//       try {
//         const dogResponse = await fetch('https://dog.ceo/api/breeds/image/random');

//         // HTTPステータスチェック
//         if (!dogResponse.ok) throw new Error('サーバーエラーが発生しました');

//         // jsonデータとして読み込む
//         const data = await dogResponse.json();
//         dogUrl.value = data.message ;// refに入れない
//         console.log(dogUrl.value); // 確認用

//         console.log('画像の取得が完了しました');
//       } catch (error) {
//         dogError.value = '画像の取得に失敗しました';
//         console.error('画像の取得に失敗しました', error);
//       } finally {
//         isDogLoading.value = false;
//       }
//     }

//     /**
//      * マウント時に実行
//      */
//     onMounted(() => {
//       fetchDog()
//     })

//     // HTML側で使いたいオブジェクトだけを記載
//     return {
//       message,
//       dogUrl,
//       isDogLoading,
//       dogError,
//       fetchDog,
//     }
//   }
// }).mount('#dog-app');

// Options API
Vue.createApp({
  data() {
    return {
      message: 'Hello vue!',
      dogUrl: '',
      isDogLoading: false,
      dogError: null
    };
  },

  methods: {
    async fetchDog() {
      this.dogError = null;
      this.isDogLoading = true;

      try {
        const dogResponse = await fetch('https://dog.ceo/api/breeds/image/random');
        // HTTPステータスチェック
        if (!dogResponse.ok) throw new Error('サーバーエラーが発生しました');

        // jsonデータとして読み込む
        const data = await dogResponse.json();
        this.dogUrl = data.message; // refに入れない
        console.log(this.dogUrl); // 確認用

        console.log('画像の取得が完了しました');
      } catch (error) {
        this.dogError = '画像の取得に失敗しました';
        console.error('画像の取得に失敗しました', error);
      } finally {
        this.isDogLoading = false;
      }
    }
  },

  mounted() {
    this.fetchDog();
  }
}).mount('#dog-app');


/**
 * Poke API
 * ポケモンを取得、検索機能、お気に入り機能（追加削除）、localStorageに保存取得
 */
const POKE_BASE_URL = 'https://pokeapi.co/api/v2/';
const POKE_STORAGE_KEY = 'poke-favorite-list';

// Composition API
// createApp({
//   setup() {
//     const pokeList = ref([]);
//     const pokeSearchText = ref('');
//     const pokeFavorites = ref([]);
//     const isPokeLoading = ref(false);
//     const pokeError = ref(null);

//     const pokePerPage = 25;
//     const currentOffsetPoke = ref(0);

//     const fetchMorePoke = async () => {
//       pokeError.value = null;
//       isPokeLoading.value = true;

//       try {
//         const pokeSavedData = localStorage.getItem(POKE_STORAGE_KEY);
//         if (pokeSavedData) {
//           try {
//             pokeFavorites.value = JSON.parse(pokeSavedData);
//             console.log('localStrageを取得しました');
//           } catch(error) {
//             pokeFavorites.value = [];
//             console.error('保存データの読み込みに失敗しました', error);
//           }
//         }

//         const pokeResponse = await fetch(`${ POKE_BASE_URL }pokemon?limit=${ pokePerPage }&offset=${ currentOffsetPoke.value }`);
//         if (!pokeResponse.ok) throw new Error('サーバーエラーが発生');
//         const pokeData = await pokeResponse.json();

//         const pokeDetailData = await Promise.all(pokeData.results.map(async (poke) => {
//           const pokeId = poke.url.split('/').filter(Boolean).pop();

//           const pokeSpeciesResponse = await fetch(`${POKE_BASE_URL}pokemon-species/${pokeId}`);
//           const pokeSpeciesData = await pokeSpeciesResponse.json();
//           // pokemon-speciesの各IDの配列の中から日本語のnameを探す
//           const pokeNameJaObj = pokeSpeciesData.names.find(name => name.language.name === 'ja-Hrkt' || name.language.name === 'ja');
//           const pokeNameJa = pokeNameJaObj ? pokeNameJaObj.name : '---';

//           // console.log(pokeData)

//           const pokeDetailResponse = await fetch(`${ POKE_BASE_URL }pokemon/${pokeId}`);
//           const pokeDetailData = await pokeDetailResponse.json()

//           const pokeTypes = pokeDetailData.types.map(t => t.type.name);
//           // console.log(pokeTypes)

//           const pokeImageFront = pokeDetailData.sprites.front_default;
//           const pokeImageBack = pokeDetailData.sprites.back_default;
//           const pokeImageShiny = pokeDetailData.sprites.front_shiny;
//           const pokeImageArtwork = pokeDetailData.sprites.other['official-artwork'].front_default;

//           return {
//             id: parseInt(pokeId),
//             nameEn: poke.name,
//             nameJa: pokeNameJa,
//             // image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`,
//             image: pokeImageArtwork,
//             types: pokeTypes,
//             imageFront: pokeImageFront,
//             imageBack: pokeImageBack,
//             imageShiny: pokeImageShiny
//           };

//         }));

//         pokeList.value = [...pokeList.value, ...pokeDetailData];
//         currentOffsetPoke.value += pokePerPage;
//         console.log('ポケモンの取得が完了');
//       } catch(error) {
//         pokeError.value = 'ポケモンの取得に失敗しました';
//         console.error('ポケモンの取得に失敗', error);
//       } finally {
//         isPokeLoading.value = false;
//       }
//     };

//     onMounted(() => {
//       fetchMorePoke();
//     });

//     // 確認用 検索キーワードをコンソールに表示
//     watch(pokeSearchText, (searchInput) => {
//       console.log(searchInput);
//     })

//     const pokeSearchList = computed(() => {
//       // 検索キーワードを空白を除き小文字に統一
//       const pokeQuery = pokeSearchText.value.toLowerCase().trim();
//       // 検索キーワードが空白を除いた空文字だった場合、図鑑一覧を表示
//       if (!pokeQuery) return pokeList.value;

//       // 図鑑一覧を抽出
//       return pokeList.value.filter(poke => {
//         // 検索キーワードがあった場合、名前（日本語・英語）にその文字が含まれているかどうか確認
//         return poke.nameJa.includes(pokeQuery) || poke.nameEn.includes(pokeQuery)
//       })
//     })

//     const isNotFoundPoke = computed(() => {
//       return pokeSearchText.value.trim() !== "" && pokeSearchText.value.length === 0;
//     });

//     const isPokeFavorite = (id) => {
//       // some 条件に合うidがいるか判定
//       return pokeFavorites.value.some(fav => fav.id === id);
//     }

//     const toggleFavorite = (poke) => {
//       const favoriteIndex = pokeFavorites.value.findIndex(fav => fav.id === poke.id);

//       if (favoriteIndex !== -1) {
//         pokeFavorites.value.splice(favoriteIndex, 1);
//         console.log('お気に入りから削除しました');
//       } else {
//         pokeFavorites.value.push(poke);
//         console.log('お気に入りに保存しました');
//       }

//       console.log(pokeFavorites.value);

//       // localStorage.setItem(POKE_STORAGE_KEY, JSON.stringify(pokeFavorites))
//     }

//     watch(
//       pokeFavorites,
//       (currentPokeFavs) => {
//         localStorage.setItem(POKE_STORAGE_KEY, JSON.stringify(currentPokeFavs));
//         console.log('localStorageを更新しました');
//       },
//       { deep: true }
//     )

//     const selectedPoke = ref(null)
//     const openPokeModal = (poke) => {
//       selectedPoke.value = poke;
//     };
//     const closePokeModal = () => {
//       selectedPoke.value = null;
//     }

//     return {
//       pokeList,
//       pokeSearchText,
//       pokeFavorites,
//       isPokeLoading,
//       pokeError,
//       pokePerPage,
//       currentOffsetPoke,
//       fetchMorePoke,
//       pokeSearchList,
//       isNotFoundPoke,
//       isPokeFavorite,
//       toggleFavorite,
//       selectedPoke,
//       openPokeModal,
//       closePokeModal
//     }
//   }
// }).mount('#poke-app');

// Options API
Vue.createApp({
  data() {
    return {
      pokeList: [],
      pokeSearchText: '',
      pokeFavorites: [],
      isPokeLoading: false,
      pokeError: null,
      pokePerPage: 25,
      currentOffsetPoke: 0,
      selectedPoke: null
    };
  },

  computed: {
    pokeSearchList() {
      // 検索キーワードを空白を除き小文字に統一
      const pokeQuery = this.pokeSearchText.toLowerCase().trim();
      // 検索キーワードが空白を除いた空文字だった場合、図鑑一覧を表示
      if (!pokeQuery) return this.pokeList;

      // 図鑑一覧を抽出
      return this.pokeList.filter(poke => {
        // 検索キーワードがあった場合、名前（日本語・英語）にその文字が含まれているかどうか確認
        return poke.nameJa.includes(pokeQuery) || poke.nameEn.includes(pokeQuery);
      });
    },

    isNotFoundPoke() {
      return this.pokeSearchText.trim() !== "" && this.pokeSearchText.length === 0;
    }
  },

  watch: {
    // 確認用 検索キーワードをコンソールに表示
    pokeSearchText(searchInput) {
      console.log(searchInput);
    },

    pokeFavorites: {
      handler(currentPokeFavs) {
        localStorage.setItem(POKE_STORAGE_KEY, JSON.stringify(currentPokeFavs));
        console.log('localStorageを更新しました');
      },
      deep: true
    }
  },

  methods: {
    async fetchMorePoke() {
      this.pokeError = null;
      this.isPokeLoading = true;

      try {
        if (this.currentOffsetPoke === 0) {
          const pokeSavedData = localStorage.getItem(POKE_STORAGE_KEY);
          if (pokeSavedData) {
            try {
              this.pokeFavorites = JSON.parse(pokeSavedData);
              console.log('localStrageを取得しました');
            } catch(error) {
              this.pokeFavorites = [];
              console.error('保存データの読み込みに失敗しました', error);
            }
          }
        }

        const pokeResponse = await fetch(`${ POKE_BASE_URL }pokemon?limit=${ this.pokePerPage }&offset=${ this.currentOffsetPoke }`);
        if (!pokeResponse.ok) throw new Error('サーバーエラーが発生');
        const pokeData = await pokeResponse.json();

        const pokeDetailData = await Promise.all(pokeData.results.map(async (poke) => {
          const pokeId = poke.url.split('/').filter(Boolean).pop();

          const pokeSpeciesResponse = await fetch(`${POKE_BASE_URL}pokemon-species/${pokeId}`);
          const pokeSpeciesData = await pokeSpeciesResponse.json();
          // pokemon-speciesの各IDの配列の中から日本語のnameを探す
          const pokeNameJaObj = pokeSpeciesData.names.find(name => name.language.name === 'ja-Hrkt' || name.language.name === 'ja');
          const pokeNameJa = pokeNameJaObj ? pokeNameJaObj.name : '---';

          // console.log(pokeData)

          const pokeDetailResponse = await fetch(`${ POKE_BASE_URL }pokemon/${pokeId}`);
          const pokeDetailData = await pokeDetailResponse.json()

          const pokeTypes = pokeDetailData.types.map(t => t.type.name);
          // console.log(pokeTypes)

          const pokeImageFront = pokeDetailData.sprites.front_default;
          const pokeImageBack = pokeDetailData.sprites.back_default;
          const pokeImageShiny = pokeDetailData.sprites.front_shiny;
          const pokeImageArtwork = pokeDetailData.sprites.other['official-artwork'].front_default;

          return {
            id: parseInt(pokeId),
            nameEn: poke.name,
            nameJa: pokeNameJa,
            // image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`,
            image: pokeImageArtwork,
            types: pokeTypes,
            imageFront: pokeImageFront,
            imageBack: pokeImageBack,
            imageShiny: pokeImageShiny
          };

        }));

        this.pokeList = [...this.pokeList, ...pokeDetailData];
        this.currentOffsetPoke += this.pokePerPage;
        console.log('ポケモンの取得が完了');
      } catch(error) {
        this.pokeError = 'ポケモンの取得に失敗しました';
        console.error('ポケモンの取得に失敗', error);
      } finally {
        this.isPokeLoading = false;
      }
    },

    isPokeFavorite(id) {
      // some 条件に合うidがいるか判定
      return this.pokeFavorites.some(fav => fav.id === id);
    },

    toggleFavorite(poke) {
      const favoriteIndex = this.pokeFavorites.findIndex(fav => fav.id === poke.id);

      if (favoriteIndex !== -1) {
        this.pokeFavorites.splice(favoriteIndex, 1);
        console.log('お気に入りから削除しました');
      } else {
        this.pokeFavorites.push(poke);
        console.log('お気に入りに保存しました');
      }

      console.log(value.pokeFavorites);
    },

    openPokeModal(poke) {
      this.selectedPoke = poke;
    },

    closePokeModal() {
      this.selectedPoke = null;
    }

  },

  mounted() {
    this.fetchMorePoke();
  }
}).mount('#poke-app')