
//Reads ticket description
//Returns ticket description
const getDescription = () => {
    return document.querySelector('.lean-rooster.rooster-editor.text-element.view-mode').innerText;
}

//Reads the tickets discussion
//Returns array with all comments
const getDiscussion = () => {
    let comments = document.querySelectorAll('.comments-section .wit-comment-item');
    let commentsList = [];

    for(let i = 0; i < comments.length; i++) {
        const content = comments[0].querySelector('.comment-content').innerText;
        const author = comments[0].querySelector('.user-display-name').innerText;

        const comment = {
            "content": content,
            "author": author
        }

        commentsList.push(comment);
    }

    return commentsList;
}

//Download markdown file
const download = () => {
    return '<a href="data:application/octet-stream;charset=utf-16le;base64,//5mAG8AbwAgAGIAYQByAAoA">text file</a>';
}