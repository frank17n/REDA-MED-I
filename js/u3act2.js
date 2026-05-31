
        const columnAItems = document.querySelectorAll('#columnA .item');
        const columnBItems = document.querySelectorAll('#columnB .item');
        const resultCard = document.getElementById('result-card');
        const finalScore = document.getElementById('final-score');
        const feedbackText = document.getElementById('feedback-text');

        let selectedAItem = null;
        let aciertos = 0;
        let errores = 0;
        const totalParejas = columnAItems.length; // 3 parejas en total

        // Asignar eventos a la Columna A
        columnAItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('correct')) return;

                if (selectedAItem) {
                    selectedAItem.classList.remove('selected');
                }
                selectedAItem = e.target;
                selectedAItem.classList.add('selected');
                resetIncorrectStates();
            });
        });

        // Asignar eventos a la Columna B
        columnBItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Si no hay selección previa en la columna A o si ya está resuelto, ignorar
                if (!selectedAItem || e.target.classList.contains('correct')) return;

                const bItem = e.target;
                
                if (selectedAItem.dataset.id === bItem.dataset.match) {
                    // --- EMPAREJAMIENTO CORRECTO ---
                    selectedAItem.classList.remove('selected', 'incorrect');
                    selectedAItem.classList.add('correct');
                    bItem.classList.add('correct');
                    aciertos++;
                    selectedAItem = null;
                    
                    verificarFinalizacion();
                } else {
                    // --- EMPAREJAMIENTO INCORRECTO ---
                    selectedAItem.classList.remove('selected');
                    selectedAItem.classList.add('incorrect');
                    bItem.classList.add('incorrect');
                    errores++;
                    selectedAItem = null;
                }
            });
        });

        // Limpia los colores rojos de error cuando se hace un nuevo intento
        function resetIncorrectStates() {
            const incorrectItems = document.querySelectorAll('.incorrect');
            incorrectItems.forEach(item => item.classList.remove('incorrect'));
        }

        // Valida si el usuario terminó la dinámica para dar la nota
        function verificarFinalizacion() {
            if (aciertos === totalParejas) {
                setTimeout(() => {
                    resultCard.style.display = 'block';
                    finalScore.textContent = `${aciertos} / ${totalParejas}`;
                    
                    if (errores === 0) {
                        feedbackText.innerHTML = "<strong>¡Puntuación Perfecta!</strong> Has relacionado todos los conceptos correctamente al primer intento.";
                    } else {
                        feedbackText.innerHTML = `Completaste la actividad resolviendo las 3 relaciones, cometiendo un total de <strong>${errores} intento(s) incorrecto(s)</strong>. ¡Sigue practicando!`;
                    }
                    
                    // Desplazar automáticamente hacia el cuadro de retroalimentación
                    resultCard.scrollIntoView({ behavior: 'smooth' });
                }, 400);
            }
        }
   