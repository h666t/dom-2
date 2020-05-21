let a = document.createElement("div");
let b = (a.innerText = "hi");
console.log(b);
console.log($(".test").append(b));
