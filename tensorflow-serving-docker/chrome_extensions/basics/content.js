let commentCount = 0;
let toxicCommentCount = 0;
let highToxicCommentCount = 0;


chrome.storage.sync.set({
    'commentCount': 0,
    'toxicCommentCount': 0,
    'highToxicCommentCount': 0
});

const startApp = () => {
    const commentSelector = 'div.tw6a2znq.sj5x9vvc.d1544ag0.cxgpxx05:not([data-visualcompletion="ignore"]):not([role="button"]):not(.checked)';
    const commentContentSelector = 'div.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql > div';
    const commentAllContentSelector = "span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d3f4x2em.fe6kdd0r.mau55g9w.c8b282yb.iv3no6db.jq4qci2q.a3bd9o3v.b1v8xokw.oo9gr5id";
    const authorSelector = 'span.nc684nl6';

    console.log("App start");

    const sendToxicCheck = () => {
        let commentUnchecked = Array.from(document.querySelectorAll(commentSelector));
        let texts = commentUnchecked.map(comment => {
            ++commentCount;
            let wholeText = '';
            Array.from(comment.querySelectorAll(commentContentSelector)).forEach(commentText => {
                wholeText += commentText.innerText + '\n';
            });
            wholeText = wholeText.trim();

            return wholeText;
        });

        // fetch("http://localhost:5000/api/checked_toxic", {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "Accept": "application/json"
        //     },
        //     mode: "cors",
        //     body: JSON.stringify(texts)
        // })
        //     .then(response => {
        //         if (response.ok) {
        //             return response.json();
        //         } else {
        //             throw new Error("Server is not connected");
        //         }
        //     })
        //     .then(result => {
                commentUnchecked.forEach((comment, index) => {
                    let fakeResult = Math.random();
                    const badge = document.createElement("div");
                    badge.classList.add('toxic-badge');
                    badge.style.display = "flex";
                    badge.style.justifyContent = "center";
                    badge.style.padding = "0.25rem 0.5rem";
                    badge.style.borderRadius = "100px";
                    badge.style.margin = "0.25rem 0.5rem";
                    badge.style.backgroundColor = "#16a085";
                    badge.style.color = "#ffffff";
                    badge.style.fontSize = "12px";
                    badge.style.fontWeight = "normal";
                    badge.style.display = "inline-block";
                    // badge.innerText = 'Độ toxic: '+Math.round(result.response[index]*10000)/100+'%';
                    badge.innerText = 'Toxic: ' + Math.round(fakeResult * 10000) / 100 + '%';
                    comment.querySelector(authorSelector).appendChild(badge);

                    // if (result.response[index] > 0.5) {
                    if (fakeResult > 0.5) {
                        ++toxicCommentCount;

                        comment.style.opacity = '0.3';
                        comment.onmouseover = () => comment.style.opacity = '1';
                        comment.onmouseout = () => comment.style.opacity = '0.3';
                        comment.querySelector(".toxic-badge").style.backgroundColor = "#f39c12";
                        comment.querySelector(".toxic-badge").style.color = "#000000";

                        // if (result.response[index] > 0.75) {
                        if (fakeResult > 0.75) {
                            ++highToxicCommentCount;
                            --toxicCommentCount;

                            comment.querySelector(".toxic-badge").style.backgroundColor = "#c0392b";
                            comment.querySelector(".toxic-badge").style.color = "#ffffff";
                            comment.querySelector(".toxic-badge").style.opacity = "1";

                            const originalText =  comment.innerHTML;
                            const open = document.createElement("span");
                            open.href = "#";
                            open.innerText = "đây";
                            open.style.textDecoration = "underline";
                            open.style.color = "#4d87c7";
                            open.onclick = () => comment.innerHTML = originalText;

                            const commentAllContent = comment.querySelector(commentAllContentSelector);
                            commentAllContent.innerHTML = '';
                            commentAllContent.appendChild(document.createTextNode("Bình luận bị ẩn vì có độ toxic cao, nhấn vào "));
                            commentAllContent.appendChild(open);
                            commentAllContent.appendChild(document.createTextNode(" để xem bình luận"));
                        }
                    }
                    comment.classList.add("checked");

                    chrome.storage.sync.set({
                        'commentCount': commentCount,
                        'toxicCommentCount': toxicCommentCount,
                        'highToxicCommentCount': highToxicCommentCount
                    });
                });
            // })
            // .catch(error => {
            //     console.log('Error message: ' + error.message);
            // });
    }

    const runApp = setTimeout(
        function repeatSend() {
            sendToxicCheck();
            setTimeout(repeatSend, 500)
        }
    );
}

startApp();