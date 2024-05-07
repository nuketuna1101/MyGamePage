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

function changeFilter(targetMode){
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


function showItems(){
    $('.itembox').empty()

    $.ajax({
        type: "GET",
        url: "/items",
        data: {'filterMode': filterMode},
        success: function(response) {
            if (response['result'] != 'success') {
                alert('failed to load data. w. filter by' + filterMode)
                return
            }
            console.log("showItems success w. mode: " + filterMode);
            addItems(response['item_list']);
        },
    })
}
function addItems(items) {
    console.log("+-- addItems called");    
    // for 문을 활용하여 movies 배열의 요소를 차례대로 조회합니다.
    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        let id = item['id'];
        let title = item['title'];
        let img = item['img'];
        let likes = item['likes'];
        let bookmark = item['bookmark'];

        let bookmarkHtml = (bookmark) ?
        `
        <img src="static/img/svg_star_yellow.svg" class="item-bookmark btn-100x100" onclick="toggleBookmark('${id}');" alt="Bookmark">    
        `
        :
        `
        <img src="static/img/svg_star_black.svg" class="item-bookmark btn-100x100" onclick="toggleBookmark('${id}');" alt="Bookmark">    
        `
        ;

        let itemHtml = `
            <div class="item-instance">
                <div>
                    <span class="item-title">${title}</span>
                    <span class="item-bookmark">bookmark</span> 
                    ${bookmarkHtml}
                </div>

                <span class="item-likes">Likes: ${likes}</span>
                <img src="${img}" class="item-img"/>                      

                <div class="container-footerbtns">
                    <button class="btn-footerbtn" onclick="window.scrollTo(0, 0);">Go to Top</button>
                    <button class="btn-footerbtn" onclick="pressLike('${id}');">Recommend!</button>
                    <button class="btn-footerbtn" onclick="searchOnGoogle('${title}');return false;">Search on Google</button>
                </div>
            </div>
        `;

        $('.itembox').append(`${itemHtml}`);
    }
}


function toggleBookmark(id){
    $.ajax({
        type: "POST",
        url: "/bookmark",
        data: {'targetID': id},
        error: function(request, status, error){
            alert("code: "+ request.status + "\n" 
            + "message: " + request.responseText + "\n"
            + "error: " + error);
        },
        success: function (response) {
            if (response['result'] != 'success') {
                alert('failed to toggleBookmark')
                return
            }
            alert('toggleBookmark api :: success. ')
            showItems();
        }
    });
} 
            
function pressLike(id) {
    $.ajax({
        type: "POST",
        url: "/likes",
        data: {"targetID": id},
        error: function(request, status, error){
            alert("code: "+ request.status + "\n" 
            + "message: " + request.responseText + "\n"
            + "error: " + error);
        },
        success: function (response) {
            if (response['result'] != 'success') {
                alert('failed to increase likes')
                return
            }
            alert('Likes!');
            showItems();
        }
    });
}

function searchOnGoogle(inputString){
    $.ajax({
        type: "GET",
        url: "/search",
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