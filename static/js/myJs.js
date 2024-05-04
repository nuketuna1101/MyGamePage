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
    // $("#cards-box").html("");
    // showArticles();
});


function showItems(){
    // 1. id="movie-box" 로 된 태그의 내부 html 태그를 모두 삭제합니다.
    // 2. 휴지통을 보고 있는지 여부에 따라 호출할 API 를 선택합니다.
    //    휴지통이 아닐 경우 GET /api/list
    //    휴지통일 경우 GET /api/list/trash


    $.ajax({
        type: "GET",
        url: "//",
        data: {},
        success: function() {

        },
    })

}
///////////////////////////////////////////////////////////////////////////////
// 주의: 아래 like movie 는 임의의 영화에 좋아요가 표시됩니다.
// 이 구현을 선택한 무비에 좋아요를 넣는 것으로 수정하셔야 됩니다. (함수 매개변수 및 함수 구현 모두)

function likeMovie() {
    $.ajax({
        type: "POST",
        url: "/api/like",
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