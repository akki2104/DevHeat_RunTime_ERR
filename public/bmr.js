var age = document.getElementById("age");
var height = document.getElementById("height");
var weight = document.getElementById("weight");
var male = document.getElementById("m");
var female = document.getElementById("f");
var form = document.getElementById("form");

function validateForm(){
  if(age.value=='' || height.value=='' || weight.value=='' || (male.checked==false && female.checked==false)){
    alert("All fields are required!");
    document.getElementById("submit").removeEventListener("click", countBmi);
  }else{
    countBmi();
  }
}
document.getElementById("submit").addEventListener("click", validateForm);

function countBmi(){
  document.getElementById("b2").style.opacity="1";
//   document.getElementById("b1").style.opacity="1";
  var p = [age.value, height.value, weight.value];
  var bmi;
  if(male.checked){
    p.push("male");
    bmi=88.362 +(13.397*p[2])+(4.799*p[1])-(5.677*p[0]);
  }else if(female.checked){
    p.push("female");
    bmi=447.593+(9.247*p[2])+(3.098*p[1])-(4.330*p[0]);
  }
  form.reset();
  

  var result = '';
  
  
//   var h1 = document.createElement("h1");
  var h2 = document.createElement("h2");

  var t = document.createTextNode(result);
  var b = document.createTextNode('BMR: ');
  var r = document.createTextNode(parseFloat(bmi).toFixed(2));
  
//   h1.appendChild(t);
  h2.appendChild(b);
  h2.appendChild(r);
  
//   document.body.appendChild(h1);
  document.body.appendChild(h2);
  
  document.getElementById("submit").removeEventListener("click", countBmi);
  
  document.getElementById("submit").removeEventListener("click", validateForm);
  setTimeout(function(){alert("Your diet has been send to your mail!");
  ; }, 1000);
  // document.getElementsByClassName("b1").setAttribute("opacity","1");
}

document.getElementById("submit").addEventListener("click", countBmi);
// document.getElementsByClassName("b1").setAttribute("opacity","1");

