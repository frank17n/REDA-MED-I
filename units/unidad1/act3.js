
    function verificar(){

      let respuestas = {
        p1: "b",
        p2: "d",
        p3: "c",
        p4: "a"
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
          ✅ ¡Muy bien! Todas las respuestas son correctas.<br><br>
          Puntaje: ${puntaje}/4
        `;

      }else{

        resultado.className = "resultado incorrecto";

        resultado.innerHTML = `
          ❌ Algunas relaciones son incorrectas.<br><br>
          Puntaje: ${puntaje}/4
        `;

      }

    }

  