
    function verificar(){

      let respuestas = {
        p1: "a",
        p2: "d",
        p3: "b",
        p4: "c"
      };

      let puntaje = 0;

      for(let pregunta in respuestas){

        let valor = document.getElementById(pregunta).value;

        if(valor === respuestas[pregunta]){
          puntaje++;
        }

      }

      let resultado = document.getElementById("resultado");

      resultado.style.display = "block";

      if(puntaje === 4){

        resultado.className = "resultado correcto";

        resultado.innerHTML = `
          ✅ ¡Excelente! Todas las relaciones son correctas.<br><br>
          Puntaje: ${puntaje}/4
        `;

      }else{

        resultado.className = "resultado incorrecto";

        resultado.innerHTML = `
          ❌ Algunas respuestas son incorrectas.<br><br>
          Puntaje: ${puntaje}/4
        `;
      }

    }

