// 정렬 관련
const Filter = {
    SORT_BY_ALPHABET: "alphabet",
    SORT_BY_LIKES: "likes",
    SHOW_BOOKMARKS: "bookmark",
};
// 기본값: 알파벳 순서
let filterMode = Filter.alphabet;

// index.html 로딩 이후 자동 호출
$(document).ready(function () {
    showItems();
});


function showItems(){
    $.ajax({
        type: "GET",
        url: "/items",
        data: {'filterMode': filterMode},
        success: function(response) {
            if (response['result'] != 'success') {
                alert('failed to load data. w. filter by' + filterMode)
                return
            }
            /* to do */
            console.log("+-- showItems success");
            addItems(response['item_list']);
        },
    })
}


function addItems(items) {
    console.log("+-- addItems called");
    // for 문을 활용하여 movies 배열의 요소를 차례대로 조회합니다.
    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        let title = item['title'];
        let img = item['img'];
        let likes = item['likes'];

        let itemHtml = `
            <div class="item-instance">
                <span class="item-title">${title}</span>
                <br>
                <span class="item-likes">Likes: ${likes}</span>
                <br>
                <img src="${img}" class="item-img"/>

                <div class="container-footerbtns">
                    <button href="#" class="btn-footerbtn" onclick="window.scrollTo(0, 0);">Recommend!</button>
                    <button href="#" class="btn-footerbtn" onclick="searchOnGoogle('${title}');return false;">Search on Google</button>
                </div>
            </div>
        `;

        $('.itembox').append(`${itemHtml}`);
    }
}




///////////////////////////////////////////////////////////////////////////////
// 주의: 아래 like movie 는 임의의 영화에 좋아요가 표시됩니다.
// 이 구현을 선택한 무비에 좋아요를 넣는 것으로 수정하셔야 됩니다. (함수 매개변수 및 함수 구현 모두)

function likeMovie() {
    $.ajax({
        type: "POST",
        url: "/likes",
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                alert('like api :: success.')
                showItems()
            } else {
                alert('like api :: failed.')
            }
        }
    });
}

function bookmarkItem(flag){

} 
            
function changeFilter(targetMode){
    // 필터 옵션 클릭 시 해당 필터 옵션대로 호출
    // if (filterMode == targetMode)   return;
    if (filterMode == targetMode){
        console.log("log:: same as current mode");
        return;
    }

    console.log("log:: change filter mode");
    filterMode = targetMode;
    displayFilter();
    showItems();
}

function displayFilter(){
    // 필터 옵션에 따라 버튼의 활성화 비활성화
    console.log("log:: display filter");
    document.getElementById("filter-alphabet").classList.remove("active")
    document.getElementById("filter-likes").classList.remove("active")
    document.getElementById("filter-bookmark").classList.remove("active")
}

function searchOnGoogle(inputString){
    $.ajax({
        type: "GET",
        url: "/api/search",
        data: {'title': inputString},
        success: function (response) {
            if (response['result'] != 'success') {
                alert('failed to search ' + inputString)
                return
            }
            console.log("+-- searchOnGoogle success");
        }
    });
}