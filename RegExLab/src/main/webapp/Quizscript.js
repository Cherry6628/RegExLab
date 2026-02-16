let back = document.getElementById("back");
let submit = document.getElementById("submit");
let codeCard = document.querySelectorAll('.card');
let question = document.getElementById("question");
let answer;
let userAnswer;
let userElement;
const option = [
	document.getElementById("option1"),
	document.getElementById("option2"),
	document.getElementById("option3"),
	document.getElementById("option4")
];
checkSelect();
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
			answer = arrIn[7];
			console.log("arrln "+arrIn);
	    })
	    .catch(err => {
	        console.log(err);
	    })
})
back.addEventListener('mouseenter', () => {
    back.style.background = '#2563eb';
});
back.addEventListener('mouseleave', () => {
    back.style.background = '#3b82f6'; 
});
function checkSelect () {
    const isFocused = Array.from(codeCard).some(card => card.contains(document.activeElement));
    if (isFocused) {
        submit.disabled = false;
		userAnswer = document.activeElement.value;
		userElement = document.activeElement.id;
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
submit.addEventListener("mousedown", () => {
	console.log(codeCard);
	console.log(userElement);
	if(userAnswer == answer){
		for(let i=0;i<option.length;i++){
			if(option[i].id == userElement){
				option[i].style.color = "green";
				option[i].style.backgroundColor = "#dcedc8";
				option[i].style.border = "3px solid green";							
			}
			else{
				option[i].style.color = "red";
				option[i].style.border = "3px solid red";
			}
		}
		console.log("correct");
	}
	else{
		document.activeElement.style.backgroundColor = " #ffcdd2";
		let useAns;
		console.log("wrong");
		for(let i=0;i<option.length;i++){
			useAns = document.getElementById(`option${i+1}`).value;
			if(useAns != answer){
				option[i].style.color = "red";
				option[i].style.border = "3px solid red";							
			}
			else{
				option[i].style.color = "green";
				option[i].style.backgroundColor = "#dcedc8";
				option[i].style.border = "3px solid green";
			}
		}
	}
})
back.addEventListener("click", () => {
	window.location.href ="/RegExLab/index.html?code=" + new URL(window.location.href).searchParams.get("code");
})