
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
    const downloadContainer = document.createElement('div');
    downloadContainer.innerHTML = `<a id="ADO_DOWNLOAD" style="display: none;" href="data:application/octet-stream;charset=utf-16le;base64,//5mAG8AbwAgAGIAYQByAAoA" download="ADO_${getType()}_${getTicketNumber()}.md">text file</a>`;
    document.body.appendChild(downloadContainer);
    document.querySelector('#ADO_DOWNLOAD').click();
}

//Get Ticket Number
const getTicketNumber = () => {
    const ticketno = parseInt(document.querySelector('.work-item-form-id span').innerText);
    return typeof ticketno == "number" ? ticketno : null;
}

//Get Ticket Title
const getTitle = () => {
    return document.querySelector('#witc_321_txt').value;
}

//Get Ticket Type
const getType = () => {
    return document.querySelector('.work-item-type-icon').getAttribute('aria-label');
}