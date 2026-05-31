// script.js - carga JSON, renderiza y mantiene la lógica DnD con delegación y accesibilidad

document.addEventListener('DOMContentLoaded', () => { // esperar a que el DOM esté listo
  const source = document.getElementById('source'); // referencia al panel origen
  const targetsContainer = document.getElementById('targets'); // referencia al contenedor de targets
  const verifyBtn = document.getElementById('verifyBtn'); // referencia al botón verificar
  const resetBtn = document.getElementById('resetBtn'); // referencia al botón reiniciar
  const scoreBox = document.getElementById('score'); // referencia al elemento de puntuación
  const feedbackBox = document.getElementById('feedback'); // referencia al elemento de feedback

  let targets = []; // array actualizado de nodos .target (se rellena tras render)
  let draggables = []; // array actualizado de nodos .draggable (se rellena tras render)
  let keyboardSelected = null; // elemento seleccionado por teclado (accesibilidad)
  let initial = []; // estado inicial (id, parentId, index) para reinicio

  fetch('preguntas.json') // solicitar el archivo JSON con preguntas y zonas
    .then(res => res.json()) // parsear la respuesta como JSON
    .then(data => { // cuando el JSON esté disponible
      renderTargets(data.targets); // crear y añadir las zonas destino al DOM
      renderOptions(data.options); // crear y añadir las opciones al DOM
      draggables = Array.from(document.querySelectorAll('.draggable')); // actualizar lista de draggables
      targets = Array.from(document.querySelectorAll('.target')); // actualizar lista de targets
      initial = draggables.map(el => { // guardar estado inicial de cada draggable
        const p = el.parentElement; // padre actual del elemento
        return { id: el.dataset.id, parentId: p.id || 'source', index: Array.from(p.children).indexOf(el) }; // objeto estado
      });
      actualizarEstilosDestinos(); // aplicar clases occupied según contenido
      attachZoneListeners(); // adjuntar listeners a zonas (drop/keyboard)
    })
    .catch(err => { // manejar errores de carga
      console.error('Error cargando preguntas.json', err); // log en consola
      feedbackBox.innerHTML = '<div class="hint">No se pudo cargar preguntas.json</div>'; // mensaje visible
    });

  function renderTargets(list) { // función que crea nodos .target desde el JSON
    targetsContainer.innerHTML = ''; // limpiar contenedor antes de renderizar
    list.forEach(t => { // iterar cada definición de target
      const node = document.createElement('div'); // crear div para la zona
      node.className = 'target'; // asignar clase CSS
      node.id = t.id; // asignar id desde JSON
      node.tabIndex = 0; // hacerlo focalizable por teclado
      node.dataset.accepts = t.accepts; // indicar qué id acepta esta zona
      node.setAttribute('aria-dropeffect', 'none'); // ARIA inicial
      node.innerHTML = `<span class="target-label">${escapeHtml(t.label)}</span>`; // contenido visible (etiqueta)
      targetsContainer.appendChild(node); // añadir al DOM
    });
  }

  function renderOptions(list) { // función que crea nodos .draggable desde el JSON
    source.innerHTML = ''; // limpiar panel origen antes de renderizar
    list.forEach(o => { // iterar cada opción
      const node = document.createElement('div'); // crear contenedor de la opción
      node.className = 'draggable'; // clase CSS
      node.tabIndex = 0; // hacerlo focalizable
      node.role = 'option'; // rol ARIA
      node.dataset.id = o.id; // id único de la opción
      node.setAttribute('draggable', 'true'); // habilitar DnD nativo
      node.setAttribute('aria-grabbed', 'false'); // ARIA inicial

      if (o.type === 'image' && o.thumb) { // si la opción es imagen y tiene thumb
        const img = document.createElement('img'); // crear elemento img
        img.className = 'thumb'; // clase CSS miniatura
        img.alt = o.label || ''; // texto alternativo
        img.src = o.thumb; // fuente de la imagen (data URI o ruta)
        node.appendChild(img); // añadir imagen al nodo
      } else { // si no es imagen, mostrar texto en una miniatura estilizada
        const label = document.createElement('div'); // crear div para label
        label.className = 'thumb label'; // clase CSS para label
        label.textContent = o.label || ''; // texto visible
        node.appendChild(label); // añadir label al nodo
      }

      source.appendChild(node); // añadir la opción al panel origen
    });
  }

  document.addEventListener('dragstart', (e) => { // delegación global: inicio de arrastre
    const drag = e.target.closest('.draggable'); // buscar el .draggable más cercano
    if (!drag) return; // si no es un draggable, salir
    e.dataTransfer.setData('text/plain', drag.dataset.id); // pasar id por dataTransfer
    e.dataTransfer.effectAllowed = 'move'; // efecto permitido
    drag.classList.add('dragging'); // marcar visualmente como arrastrando
  });

  document.addEventListener('dragend', (e) => { // delegación global: fin de arrastre
    const drag = e.target.closest('.draggable'); // buscar draggable
    if (!drag) return; // si no existe, salir
    drag.classList.remove('dragging'); // quitar clase visual
  });

  function getDropZones() { // obtener zonas que aceptan drop (targets + source)
    return [...Array.from(document.querySelectorAll('.target')), source]; // combinar arrays
  }

  function attachZoneListeners() { // adjuntar listeners a cada zona (drop/keyboard)
    getDropZones().forEach(zone => { // iterar zonas
      zone.addEventListener('dragover', onZoneDragOver); // permitir dragover
      zone.addEventListener('dragleave', () => zone.classList.remove('over')); // limpiar clase over
      zone.addEventListener('drop', onZoneDrop); // manejar drop
      zone.addEventListener('keydown', onZoneKeyDown); // soporte teclado en zona
    });
  }

  function onZoneDragOver(e) { // handler para dragover en zona
    e.preventDefault(); // necesario para permitir drop
    e.dataTransfer.dropEffect = 'move'; // efecto visual
    if (this.classList.contains('target')) { // si es una target
      this.classList.toggle('over', !this.querySelector('.draggable')); // marcar solo si está vacía
    }
  }

  function onZoneDrop(e) { // handler para drop en zona
    e.preventDefault(); // prevenir comportamiento por defecto
    this.classList.remove('over'); // limpiar clase over
    const id = e.dataTransfer.getData('text/plain'); // obtener id transferido
    const dragged = document.querySelector(`[data-id="${id}"]`); // localizar elemento real
    if (!dragged) return; // seguridad: si no existe, salir
    if (this.classList.contains('target') && this.querySelector('.draggable')) return; // bloquear si target ya ocupado
    this.appendChild(dragged); // mover elemento al nuevo contenedor
    actualizarEstilosDestinos(); // actualizar clases occupied y ARIA
  }

  function onZoneKeyDown(e) { // handler para soltar por teclado en zona
    if ((e.key !== 'Enter' && e.key !== ' ') || !keyboardSelected) return; // solo Enter/Espacio y si hay selección
    e.preventDefault(); // prevenir scroll o comportamiento por defecto
    if (this.classList.contains('target') && this.querySelector('.draggable')) return; // bloquear si target ocupado
    this.appendChild(keyboardSelected); // mover elemento seleccionado por teclado
    limpiarSeleccionTeclado(); // limpiar estado teclado
    actualizarEstilosDestinos(); // actualizar estilos
  }

  document.addEventListener('keydown', (e) => { // delegación teclado para seleccionar draggables
    if (e.key !== 'Enter' && e.key !== ' ') return; // solo Enter/Espacio
    const focused = document.activeElement; // elemento con foco actual
    if (!focused || !focused.classList || !focused.classList.contains('draggable')) return; // si no es draggable, salir
    e.preventDefault(); // prevenir comportamiento por defecto
    if (!keyboardSelected) { // si no hay selección previa
      keyboardSelected = focused; // marcar elemento seleccionado
      keyboardSelected.classList.add('dragging'); // clase visual
      keyboardSelected.setAttribute('aria-grabbed', 'true'); // ARIA
      targetsContainer.classList.add('keyboard-mode'); // resaltar zonas para soltar
      scoreBox.textContent = 'Elemento seleccionado. Navega a una zona y pulsa Enter.'; // guía al usuario
    } else { // si ya había seleccionado, deseleccionar
      limpiarSeleccionTeclado(); // limpiar selección
    }
  });

  function limpiarSeleccionTeclado() { // limpiar estado de selección por teclado
    if (!keyboardSelected) return; // si no hay selección, salir
    keyboardSelected.classList.remove('dragging'); // quitar clase visual
    keyboardSelected.setAttribute('aria-grabbed', 'false'); // ARIA
    keyboardSelected = null; // reset variable
    targetsContainer.classList.remove('keyboard-mode'); // quitar modo teclado
    scoreBox.textContent = ''; // limpiar mensaje
  }

  function actualizarEstilosDestinos() { // actualizar clases occupied y atributos ARIA en targets
    const tNodes = Array.from(document.querySelectorAll('.target')); // obtener targets actuales
    tNodes.forEach(z => { // iterar cada zona
      const has = !!z.querySelector('.draggable'); // true si tiene un draggable dentro
      z.classList.toggle('occupied', has); // alternar clase occupied
      z.setAttribute('aria-dropeffect', has ? 'move' : 'none'); // actualizar ARIA
    });
  }

  verifyBtn.addEventListener('click', () => { // al pulsar verificar
    const tNodes = Array.from(document.querySelectorAll('.target')); // obtener targets actuales
    let correctas = 0; // contador de aciertos
    tNodes.forEach(z => { // iterar zonas
      const placed = z.querySelector('.draggable'); // elemento colocado en la zona
      if (placed && placed.dataset.id === z.dataset.accepts) correctas++; // comparar ids
    });
    const nota = ((correctas / tNodes.length) * 5).toFixed(1); // calcular nota en escala 0-5 con 1 decimal
    scoreBox.textContent = `Puntuación: ${nota} / 5.0`; // mostrar nota
    if (nota === '5.0') { // feedback positivo si todo correcto
      feedbackBox.innerHTML = '<div class="hint" style="color:#10b981">¡Excelente! Todas las respuestas son correctas.</div>';
    } else { // feedback con número de aciertos
      feedbackBox.innerHTML = `<div class="hint">Tienes ${correctas} de ${tNodes.length} correctas. Revisa y vuelve a intentar.</div>`;
    }
  });

  resetBtn.addEventListener('click', () => { // al pulsar reiniciar
    initial.forEach(s => { // restaurar cada elemento a su padre e índice original
      const el = document.querySelector(`[data-id="${s.id}"]`); // localizar elemento por data-id
      if (!el) return; // si no existe, continuar
      const parent = document.getElementById(s.parentId) || source; // localizar padre original
      const children = Array.from(parent.children); // hijos actuales del padre
      const ref = (s.index >= 0 && s.index < children.length) ? children[s.index] : null; // nodo de referencia
      parent.insertBefore(el, ref); // insertar en la posición original o al final
      el.classList.remove('dragging'); // limpiar clase visual
      el.removeAttribute('aria-grabbed'); // limpiar ARIA
    });
    limpiarSeleccionTeclado(); // limpiar selección por teclado
    scoreBox.textContent = ''; // limpiar puntuación
    feedbackBox.innerHTML = ''; // limpiar feedback
    actualizarEstilosDestinos(); // actualizar estilos de targets
  });

  function escapeHtml(str = '') { // utilidad para escapar texto y evitar inyección
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); // reemplazos seguros
  }
}); // fin DOMContentLoaded