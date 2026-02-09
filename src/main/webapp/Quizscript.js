let back = document.getElementById("back");
let submit = document.getElementById("submit");
let codeCard = document.querySelectorAll('.code-card');
let question = document.getElementById("question");
document.addEventListener("DOMContentLoaded", ()=>{
	const code = new URL(location.href).searchParams.get("code");
	console.log(code);
	if (code){
		question.innerText = code;
	}
	fetch("quiz", {
	    method: "POST",
	    headers: {
	        "Content-Type": "application/json"
	    },
	    body: JSON.stringify({ msg: code })
	}).then(res => res.json())
	    .then(result => {
	        console.log(result.response);
			let arrIn = result.response.split("\n");
			document.getElementById("option1").innerText = arrIn[1];
			document.getElementById("option2").innerText = arrIn[2];
			document.getElementById("option3").innerText = arrIn[3];
			document.getElementById("option4").innerText = arrIn[4];
	    })
	    .catch(err => {
	        console.log(err);
	    })
})
submit.disabled = true;
submit.style.cursor = 'not-allowed';
back.addEventListener('mouseenter', () => {
    back.style.background = '#2563eb';
});
back.addEventListener('mouseleave', () => {
    back.style.background = '#3b82f6'; 
});
submit.addEventListener('mouseenter', () => {
    submit.style.background = '#3b82f6'; 
});
function checkSelect () {
    const isFocused = Array.from(codeCard).some(card => card.contains(document.activeElement));
    if (isFocused) {
        submit.disabled = false;
        submit.style.cursor = "pointer"; 
        submit.addEventListener('mouseenter', () => {
            submit.style.background = '#2563eb';
        });
        submit.addEventListener('mouseleave', () => {
            submit.style.background = '#3b82f6'; 
        });
    } 
    else {
        submit.disabled = true;
        submit.style.cursor = 'not-allowed'; 
        submit.addEventListener('mouseenter', () => {
            submit.style.background = '#3b82f6'; 
        });
    }
}
codeCard.forEach(card=>{
    card.addEventListener("focusin",checkSelect);
    card.addEventListener("focusout",checkSelect);
})
submit.addEventListener("click", () => {
    console.loh("hi");
})
back.addEventListener("click", () => {
	window.location.href =
	    "/RegExLab/index.html?code=" +
	    new URL(window.location.href).searchParams.get("code");
})