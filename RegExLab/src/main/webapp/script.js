let msg = document.getElementById("msgBox");
let Quiz = document.getElementById("goQuiz");
let submit = document.getElementById("submit");
document.addEventListener("DOMContentLoaded", () => {
    const code = new URL(location.href).searchParams.get("code");
    if (code) {
        msg.value = code;
    }
    const isEmpty = msg.value.trim() === "";
    Quiz.disabled = isEmpty;
    submit.disabled = isEmpty;
    if (isEmpty) {
        Quiz.style.cursor = "not-allowed";
        submit.style.cursor = "not-allowed";
    }
})
msg.addEventListener("input", function() {
    const isEmpty = msg.value.trim() === "";
    Quiz.disabled = isEmpty;
    submit.disabled = isEmpty;
    if (isEmpty) {
        Quiz.style.cursor = "not-allowed";
        submit.style.cursor = "not-allowed";
        Quiz.addEventListener('mouseenter', () => {
            Quiz.style.background = '#3b82f6';
        });
        submit.addEventListener('mouseenter', () => {
            submit.style.background = '#3b82f6';
        })
    }
    else {
        Quiz.style.cursor = "pointer";
        submit.style.cursor = "pointer";
        submit.addEventListener('mouseenter', () => {
            submit.style.background = '#2563eb';
        });
        Quiz.addEventListener('mouseenter', () => {
            Quiz.style.background = '#2563eb';
        });

        Quiz.addEventListener('mouseleave', () => {
            Quiz.style.background = '#3b82f6';
        });
        submit.addEventListener('mouseleave', () => {
            submit.style.background = '#3b82f6';
        });
    }
})
submit.addEventListener("click", () => {
    fetch("suggest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ msg: msg.value })
    }).then(res => res.json())
        .then(result => {
            console.log(result.response);
            const [Output, Explanation] = result.response.split("␟");
            document.getElementById("out").innerText = Output;
            document.getElementById("commend").innerText = Explanation;
        })
        .catch(err => {
            console.log(err);
        })
})
Quiz.addEventListener("click", () => {
    window.location.href ="/RegExLab/Quiz.html?code=" +encodeURIComponent(msg.value);
})