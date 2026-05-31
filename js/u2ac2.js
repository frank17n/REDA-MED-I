
    const tarjetas = document.querySelectorAll('.tarjeta-herramienta');
    const columnas = document.querySelectorAll('.columna');

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('dragstart', dragStart);
    });

    columnas.forEach(columna => {
        const listaSoltar = columna.querySelector('.lista-soltar');
        
        columna.addEventListener('dragover', dragOver);
        columna.addEventListener('dragenter', dragEnter);
        columna.addEventListener('dragleave', dragLeave);
        columna.addEventListener('drop', (e) => drop(e, listaSoltar, columna));
    });

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    function dragOver(e) {
        e.preventDefault(); // Permite que se pueda soltar aquí
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add('drag-hover');
    }

    function dragLeave() {
        this.classList.remove('drag-hover');
    }

    function drop(e, lista, columna) {
        e.preventDefault();
        columna.classList.remove('drag-hover');
        
        const idTarjeta = e.dataTransfer.getData('text/plain');
        const tarjetaArrastrada = document.getElementById(idTarjeta);
        
        // Quitar estilos de validación previos si se reubica el elemento
        tarjetaArrastrada.classList.remove('correcto', 'incorrecto');
        
        // Mover la tarjeta al contenedor correspondiente
        lista.appendChild(tarjetaArrastrada);
    }

    function verificarRespuestas() {
        let aciertos = 0;
        const totalTarjetas = tarjetas.length;

        columnas.forEach(columna => {
            const categoriaColumna = columna.getAttribute('data-category');
            const elementosDentro = columna.querySelectorAll('.tarjeta-herramienta');

            elementosDentro.forEach(elemento => {
                const tipoElemento = elemento.getAttribute('data-type');

                if (tipoElemento === categoriaColumna) {
                    elemento.classList.remove('incorrecto');
                    elemento.classList.add('correcto');
                    aciertos++;
                } else {
                    elemento.classList.remove('correcto');
                    elemento.classList.add('incorrecto');
                }
            });
        });

        // Verificar si quedaron elementos sin clasificar en el banco inicial
        const banco = document.getElementById('banco-herramientas');
        const sinClasificar = banco.querySelectorAll('.tarjeta-herramienta');
        sinClasificar.forEach(elemento => elemento.classList.remove('correcto', 'incorrecto'));

        const msgResultado = document.getElementById('resultado');
        if (aciertos === totalTarjetas) {
            msgResultado.innerHTML = "¡Excelente! 🎉 Has clasificado todas las herramientas correctamente.";
            msgResultado.style.color = "#10b981";
        } else {
            msgResultado.innerHTML = `Completaste ${aciertos} de ${totalTarjetas} correctas. ¡Sigue intentándolo!`;
            msgResultado.style.color = "#ef4444";
        }
    }
