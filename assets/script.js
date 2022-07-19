
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
    downloadContainer.innerHTML = `<a id="ADO_DOWNLOAD" style="display: none;" href="data:text/markdown;charset=utf-8,${generateBase64(generateMarkdown())}" download="ADO_${getType()}_${getTicketNumber()}.md">text file</a>`;
    document.body.appendChild(downloadContainer);
    document.querySelector('#ADO_DOWNLOAD').click();
}

//Get ticket number
const getTicketNumber = () => {
    const ticketno = parseInt(document.querySelector('.work-item-form-id span').innerText);
    return typeof ticketno == "number" ? ticketno : null;
}

//Get ticket title
const getTitle = () => {
    return document.querySelector('.work-item-form-title input').value;
}

//Get ticket type
const getType = () => {
    return document.querySelector('.work-item-type-icon').getAttribute('aria-label');
}

//Get ticket link
const getLink = () => {
    return document.location.href;
}

//Build markdown file
const generateMarkdown = () => {
return `
# **ADO:${getType()}#${getTicketNumber()} - ${getTitle()}**

## **Link zum Ticket**: 
${getLink()}

## **Was ist das Problem?**
\`\`\`
${getDescription()}
\`\`\`

## **Wie wurde das Problem gelöst?**
\`\`\`

\`\`\`

# **Sonstiges**
Tags:
`
}

//Generates base64 from text
const generateBase64 = (text) => {
    return encodeURIComponent(text);
}