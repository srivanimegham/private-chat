let generatedLink = ""

function generateLink(){

let n1 = document.getElementById("name1").value
let n2 = document.getElementById("name2").value

if(!n1 || !n2){
alert("Enter both names")
return
}

let room = n1 + "-" + n2

generatedLink = window.location.origin + "/chat.html?room=" + room

document.getElementById("linkBox").innerHTML =
`<p>Share this link with your friend:</p>
<a href="${generatedLink}" target="_blank">${generatedLink}</a>`

}

function copyLink(){

if(!generatedLink){
alert("Generate link first")
return
}

navigator.clipboard.writeText(generatedLink)

alert("Link copied! Send it to your friend")

}