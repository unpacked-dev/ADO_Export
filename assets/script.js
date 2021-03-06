//CONSTATNTS
const constants = {
    md_code: '\`\`\`',
    md_seperator: '\n\n --- \n\n',
    md_doc_link: '## **Link zum Ticket**:',
    md_doc_problem: '## **Was ist das Problem?**',
    md_doc_comments: '## **Kommentare:**',
    md_doc_solutions: '## **Wie wurde das Problem gelöst?**',
    md_doc_others: '## **Sonstiges**',
    md_doc_tags: 'Tags:',

    addon_ticket_path: 'workitems/edit/'
}


//Reads ticket description
//Returns ticket description
const getDescription = async () => {
    let description = document.querySelector('.lean-rooster.rooster-editor.text-element.view-mode').innerHTML;
    let result = description;

    const exp = new RegExp(/src\s?=\s?"([^"]*)"/g);
    let match = null;
    while ((match = exp.exec(description)) !== null) {
        let [, src] = match;
        result = result.replace(src, await getBase64FromImageUrl(src));
    }

    return result;
}

//Reads the tickets discussion
//Returns array with all comments
const getDiscussion = async () => {
    let comments = document.querySelectorAll('.comments-section .wit-comment-item');
    let commentsList = [];

    for(let i = 0; i < comments.length; i++) {
        let content = comments[i].querySelector('.comment-content').innerHTML;
        let result = content;
        const exp = new RegExp(/src\s?=\s?"([^"]*)"/g);
        let match = null;
        while ((match = exp.exec(content)) !== null) {
            let [, src] = match;
            result = result.replace(src, await getBase64FromImageUrl(src));
        }
        content = result;

        const author = comments[i].querySelector('.user-display-name').innerText;
        const timestamp = comments[i].querySelector('.comment-timestamp').innerText;

        const comment = {
            "content": content,
            "author": author,
            "timestamp": timestamp,
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
        discussionMD += '**' + discussion[i].author + ' ' + discussion[i].timestamp + ':** \n\n';
        discussionMD += discussion[i].content + '\n';
        discussionMD += constants.md_seperator;
        discussionMD += '\n';
    }

    return discussionMD;
}

//Download markdown file
const download = async () => {
    let filename = `ADO ${getType()} ${getTicketNumber()} ${getTitle()}.md`;
    filename = filename.replaceAll(' ', '_');

    const base64Content = generateBase64(await generateMarkdown());

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
const generateMarkdown = async () => {
let mdFileContent = `
# **ADO:${getType()}#${getTicketNumber()} - ${getTitle()}**

${constants.md_doc_link}
${getLink()}

${constants.md_doc_problem}
${await getDescription()}
${constants.md_seperator}

${constants.md_doc_comments}
${generateDiscussionMD(await getDiscussion())}

${constants.md_doc_solutions}
${constants.md_code}

${constants.md_code}
${constants.md_seperator}

${constants.md_doc_others}
${constants.md_doc_tags}
`

    return mdFileContent;
}

//Generates base64 from text
const generateBase64 = (text) => {
    return encodeURIComponent(text);
}

//Generates base64FromImgSource
const getBase64FromImageUrl = (src) => {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.src = src;
    });
}

//Detect URL Change
const onUrlChange = () => {
    if(location.href.includes(constants.addon_ticket_path)) {
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
    onUrlChange();

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