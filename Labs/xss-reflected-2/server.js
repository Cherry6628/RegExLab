import express from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(cookieParser());

/* ============================= */

const activeTokens = new Set();

function partialEncode(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ============================= */

app.get("/", (req, res) => {
  const q = partialEncode(req.query.q || "");

  const token = crypto.randomUUID();
  activeTokens.add(token);

  res.send(`<!doctype html>
<html>
<head>
<title>XSS Lab</title>
</head>
<body>

<h2>Search</h2>

<input id="searchInput" value="${q}" placeholder="Search..."/>
<button onclick="doSearch()">Search</button>

${q ? `<p>You searched for: ${q}</p>` : ""}

<div id="solved" style="display:none;color:green">
🎉 Lab Solved!
</div>

<script>
  const __LAB_TOKEN = "${token}";
  const base = window.location.pathname;

  async function __complete(){
    try{
      const r = await fetch(base + "/complete", {
        method:"POST",
        headers:{
          "X-Lab-Token": __LAB_TOKEN
        }
      });

      if(r.ok){
        await fetch("/lab/complete",{method:"POST"});
        document.getElementById("solved").style.display="block";
      }
    }catch(e){}
  }

  /* ========= HOOK COMMON SINKS ========= */

  const __realAlert = window.alert.bind(window);
  window.alert = function(...args){
    __realAlert(...args);
    __complete();
  };

  const __realConfirm = window.confirm.bind(window);
  window.confirm = function(...args){
    const r = __realConfirm(...args);
    __complete();
    return r;
  };

  const __realPrint = window.print.bind(window);
  window.print = function(...args){
    __realPrint(...args);
    __complete();
  };

  /* Optional: console proof */
  const __realLog = console.log.bind(console);
  console.log = function(...args){
    __realLog(...args);
    __complete();
  };

  function doSearch(){
    const q = document.getElementById("searchInput").value;
    location.href = base + "?q=" + encodeURIComponent(q);
  }

  document.getElementById("searchInput")
    .addEventListener("keypress", e=>{
      if(e.key==="Enter") doSearch();
    });

</script>
<script>
  const basePath = window.location.pathname.split("?")[0];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = basePath + "/style.css";
  document.head.appendChild(link);
</script>
</body>
</html>`);
});

/* ============================= */

app.post("/complete", (req, res) => {
  const token = req.headers["x-lab-token"];

  if (!activeTokens.has(token)) {
    return res.status(403).json({ error: "Not solved" });
  }

  activeTokens.delete(token);

  res.cookie("lab_solved", "true", {
    httpOnly: true,
    sameSite: "Strict"
  });

  res.json({ status: "ok" });
});

/* ============================= */


app.listen(3000, () => console.log("xss-reflected-2 running"));
