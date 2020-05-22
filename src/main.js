let api1 = $(".test").each((n) => console.log(n));
let api2 = api1.parent().end().addClass("red");
console.log(api2);
