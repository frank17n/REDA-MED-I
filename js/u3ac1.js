
        const draggables = document.querySelectorAll('.draggable-item');
        const dropBoxes = document.querySelectorAll('.drop-box');
        const originZone = document.getElementById('origin-zone');
        const checkButton = document.getElementById('btn-check');
        const resultDisplay = document.getElementById('result-display');
        const finalScore = document.getElementById('final-score');
        const feedbackText = document.getElementById('feedback-text');

        let draggedItem = null;

        // --- Eventos de Arrastre ---
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggedItem = draggable;
                draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                draggedItem = null;
            });
            
            // Permitir regresar el elemento al cuadro de origen al hacer clic
            draggable.addEventListener('click', () => {
                if(draggable.parentElement.classList.contains('drop-box')) {
                    const box = draggable.parentElement;
                    box.textContent = "Suelta aquí";
                    box.classList.remove('correct', 'incorrect');
                    originZone.appendChild(draggable);
                }
            });
        });

        // --- Eventos sobre las Zonas de Destino ---
        dropBoxes.forEach(box => {
            box.addEventListener('dragover', (e) => {
                e.preventDefault(); // Necesario para permitir soltar
                if (!box.querySelector('.draggable-item')) {
                    box.classList.add('hover');
                }
            });

            box.addEventListener('dragleave', () => {
                box.classList.remove('hover');
            });

            box.addEventListener('drop', () => {
                box.classList.remove('hover');
                
                // Si la caja ya tiene un elemento, no permite añadir otro
                if (box.querySelector('.draggable-item')) return;

                if (draggedItem) {
                    box.textContent = ""; // Borrar el texto "Suelta aquí"
                    box.appendChild(draggedItem);
                }
            });
        });

        // Permitir soltar de vuelta en la zona de origen
        originZone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        originZone.addEventListener('drop', () => {
            if (draggedItem) {
                const parent = draggedItem.parentElement;
                if(parent.classList.contains('drop-box')) {
                    parent.textContent = "Suelta aquí";
                    parent.classList.remove('correct', 'incorrect');
                }
                originZone.appendChild(draggedItem);
            }
        });

        // --- Sistema de Calificación ---
        checkButton.addEventListener('click', () => {
            let aciertos = 0;
            let completado = true;

            dropBoxes.forEach(box => {
                const placedItem = box.querySelector('.draggable-item');
                
                if (!placedItem) {
                    completado = false;
                    box.classList.add('incorrect');
                    return;
                }

                const expected = box.dataset.expected;
                const actual = placedItem.dataset.feature;

                if (expected === actual) {
                    aciertos++;
                    box.classList.remove('incorrect');
                    box.classList.add('correct');
                } else {
                    box.classList.remove('correct');
                    box.classList.add('incorrect');
                }
            });

            // Mostrar el panel de calificación
            resultDisplay.style.display = 'block';
            finalScore.textContent = `${aciertos} / 5`;

            if (aciertos === 5) {
                feedbackText.innerHTML = "<strong>¡Excelente trabajo!</strong> Has comprendido perfectamente todas las características de los Recursos Educativos Digitales (REDs)[cite: 359].";
                feedbackText.style.color = "#2f855a";
            } else if (!completado) {
                feedbackText.textContent = "Aún te quedan espacios vacíos por rellenar o corregir. ¡Sigue intentándolo!";
                feedbackText.style.color = "#c53030";
            } else {
                feedbackText.textContent = "Algunas características no están en su lugar correspondiente. Revisa las definiciones e intenta cambiarlas.";
                feedbackText.style.color = "#b7791f";
            }

            // Desplazar la pantalla automáticamente hacia los resultados
            resultDisplay.scrollIntoView({ behavior: 'smooth' });
        });
    