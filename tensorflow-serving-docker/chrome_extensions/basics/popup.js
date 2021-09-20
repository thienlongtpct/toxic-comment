let currentYear = new Date().getFullYear().toString();

document.querySelector("footer")
    .appendChild(document.createTextNode("@ " + currentYear + " Võ Minh Thiên Long"));

        
const runApp = setTimeout(
    function repeatSend() {
        chrome.storage.sync.get(["commentCount", "toxicCommentCount", "highToxicCommentCount"], (items) => {
            let commentCount = items.commentCount;
            let toxicCommentCount = items.toxicCommentCount;
            let highToxicCommentCount = items.highToxicCommentCount;
            let percent =  commentCount !== 0 ? Math.round(((toxicCommentCount + highToxicCommentCount) / commentCount) * 10000) / 100 : 0;

            buildGraph(commentCount-toxicCommentCount-highToxicCommentCount, toxicCommentCount, highToxicCommentCount);
            document.querySelector("#comment").innerHTML = commentCount;
            document.querySelector("#toxic-comment").innerHTML = toxicCommentCount;
            document.querySelector("#high-toxic-comment").innerHTML = highToxicCommentCount;
            document.querySelector("#percent-toxic").innerHTML = percent.toString()+"%";

            let image = document.querySelector(".image-preview");
            if (percent < 5) {
                image.src = "./icon/angel.svg";
            }
            else if (percent < 10) {
                image.src = "./icon/happy.svg";
            }
            else if (percent < 20) {
                image.src = "./icon/angry.svg";
            }
            else {
                image.src = "./icon/devil.svg";
            }
        });
        setTimeout(repeatSend, 500);
    }
)


//Pie graph
const buildGraph = (nonToxic, toxic, highToxic) => {
    let ctx = document.getElementById('myChart').getContext('2d');

    const data = {
        labels: ['Không toxic', 'Toxic', 'Cực kỳ toxic'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [nonToxic, toxic, highToxic],
                backgroundColor: ['Green', 'Orange', 'Red'],
            }
        ]
    };

    let myChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Tổng quan'
                }
            }
        },
    });
}