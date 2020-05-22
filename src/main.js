let api1 = $(".test").each((n) => console.log(n));
let api2 = api1.parent().end().addClass("red");
console.log(api2);
api2.append($("<span>1</span>"));
