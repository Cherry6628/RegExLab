document.getElementById("submit").addEventListener("click",()=>{
    let msg = document.getElementById("msgBox").value;
    fetch("http://localhost:8082/RegExLab/suggest",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({msg:msg})
    }).then(res=>res.json())
    .then(result=>{
        console.log(result.response);
		document.getElementById("out").innerText = result.response;
    })
    .catch(err=>{
        console.log(err);
    })
})