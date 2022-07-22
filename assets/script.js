
//Reads ticket description
//Returns ticket description
const getDescription = () => {
    let description = document.querySelector('.lean-rooster.rooster-editor.text-element.view-mode').innerText;
    description = description.replaceAll('\n\n', '\n');
    return description;
}

//Reads the tickets discussion
//Returns array with all comments
const getDiscussion = () => {
    let comments = document.querySelectorAll('.comments-section .wit-comment-item');
    let commentsList = [];

    for(let i = 0; i < comments.length; i++) {
        const content = comments[i].querySelector('.comment-content').innerText;
        const author = comments[i].querySelector('.user-display-name').innerText;

        const comment = {
            "content": content,
            "author": author
        }

        commentsList.push(comment);
    }

    return commentsList.reverse();
}

//Generates Markdown for discussion
const generateDiscussionMD = (discussion) => {
    if(!discussion) return;
    
    let discussionMD = '';
    for(let i = 0; i < discussion.length; i++) {
        discussionMD += '\`\`\`';
        discussionMD += discussion[i].author + '\n';
        discussionMD += discussion[i].content;
        discussionMD += '\`\`\`';
    }

    return discussionMD;
}

//Download markdown file
const download = () => {
    let filename = `ADO ${getType()} ${getTicketNumber()} ${getTitle()}.md`;
    filename = filename.replaceAll(' ', '_');

    const base64Content = generateBase64(generateMarkdown());

    const downloadContainer = document.createElement('div');
    downloadContainer.innerHTML = `<a id="ADO_DOWNLOAD" style="display: none;" href="data:text/markdown;charset=utf-8,${base64Content}" download="${filename}">text file</a>`;
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

## **Kommentare:**
\`\`\`

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

//Detect URL Change
const onUrlChange = () => {
    if(location.href.includes('workitems/edit/')) {
        try {
            document.querySelector('#TRIGGER_DL_BTN').style.display = 'block';
        } catch(err) {};
        return;
    }
    document.querySelector('#TRIGGER_DL_BTN').style.display = 'none';
}

//Init
const initScript = () => {
    //Create Button
    const downloadBtnContainer = document.createElement('div');
    downloadBtnContainer.innerHTML = '<button id="TRIGGER_DL_BTN" onclick="download();" style="position: fixed; right: 40px; bottom: 20px; display: none;">Download Ticket</button>'
    document.body.appendChild(downloadBtnContainer);

    //Display Button on Ticket Page
    let lastUrl = location.href; 
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    }).observe(document, {subtree: true, childList: true});
}

initScript();