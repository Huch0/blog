/*
    필요한 기능
    1. 글쓰기 버튼을 눌렀을 때 editor 안에 있는 내용을 서버로 POST함.
    2. 카테고리 dropdown버튼이 작동하게 변경
    3. 취소 버튼 누르면 이전 페이지로 돌아감
*/

const form = document.querySelector( 'form' );

form.addEventListener( 'submit', event => {
    event.preventDefault();
    
    // Get the data from the CKEditor 5 instance
    const data = editor.getData();
    
    // Send the data to the server
    sendDataToServer( data );
} );

function sendDataToServer( data ) {
    const xhr = new XMLHttpRequest();
    
    xhr.open( 'POST', '/server/post' );
    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhr.send( 'data=' + encodeURIComponent( data ) );
}
