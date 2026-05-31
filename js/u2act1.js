
function calificar(){

  let respuestas = {
    p1:"b",
    p2:"a",
    p3:"a",
    p4:"b",
    p5:"a"
  };

  let puntos = 0;

  for(let pregunta in respuestas){

    let seleccion = document.querySelector(`input[name="${pregunta}"]:checked`);

    let labels = document.querySelectorAll(`input[name="${pregunta}"]`);

    labels.forEach(op => {
      op.parentElement.classList.remove("correcta","incorrecta");
    });

    if(seleccion){

      if(seleccion.value === respuestas[pregunta]){
        puntos++;
        seleccion.parentElement.classList.add("correcta");
      }else{
        seleccion.parentElement.classList.add("incorrecta");

        labels.forEach(op => {
          if(op.value === respuestas[pregunta]){
            op.parentElement.classList.add("correcta");
          }
        });
      }
    }
  }

  document.getElementById("resultado").innerHTML =
    `Obtuviste ${puntos} de 5 respuestas correctas.`;
}

