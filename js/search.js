function ocultarTodasLasColumnas() {
    var columnas = document.querySelectorAll('.column');
    columnas.forEach(function(columna) {
        columna.style.display = 'none';
    });
}

function mostrarColumna(numColumna) {
    ocultarTodasLasColumnas();
    var columnaAMostrar = document.getElementById('columna' + numColumna);
    columnaAMostrar.style.display = 'flex';
}
