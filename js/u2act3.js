const columnAItems = document.querySelectorAll('#columnA .item');
const columnBItems = document.querySelectorAll('#columnB .item');
let selectedAItem = null;

// Contadores para la calificación
let aciertos = 0;
let errores = 0;
const totalParejas = columnAItems.length; // Son 7 en total

columnAItems.forEach(item => {
    item.addEventListener('click', selectAItem);
});

columnBItems.forEach(item => {
    item.addEventListener('click', selectBItem);
});

function selectAItem(e) {
    // Si ya está correcto, no hacer nada
    if (e.target.classList.contains('correct')) return;

    if (selectedAItem) {
        selectedAItem.classList.remove('selected');
    }
    selectedAItem = e.target;
    selectedAItem.classList.add('selected');
    resetIncorrectStates();
}

function selectBItem(e) {
    // Si no hay seleccionado en A o si el de B ya está correcto, no hacer nada
    if (!selectedAItem || e.target.classList.contains('correct')) return;

    const bItem = e.target;
    
    if (selectedAItem.dataset.id === bItem.dataset.match) {
        // Enlace Correcto
        selectedAItem.classList.remove('selected');
        selectedAItem.classList.add('correct');
        bItem.classList.add('correct');
        aciertos++; 
        selectedAItem = null;
        
        // Verificar si ya terminó todas
        verificarFinalizacion();
    } else {
        // Enlace Incorrecto
        selectedAItem.classList.remove('selected');
        selectedAItem.classList.add('incorrect');
        bItem.classList.add('incorrect');
        errores++;
        selectedAItem = null;
    }
}

function resetIncorrectStates() {
    const incorrectItems = document.querySelectorAll('.incorrect');
    incorrectItems.forEach(item => item.classList.remove('incorrect'));
}

function verificarFinalizacion() {
    
    if (aciertos === totalParejas) {
     
        setTimeout(() => {
            alert(`¡Felicidades! Has completado la actividad.\n\n` +
                  `📊 Resultados:\n` +
                  `• Parejas correctas: ${aciertos}/${totalParejas} \n` +
                  `• Intentos incorrectos: ${errores} \n\n` +
                  `¡Buen trabajo analizando la información confiable! `);
        }, 500); // Un pequeño retraso para que se vea el cambio de color verde antes del mensaje
    }
}