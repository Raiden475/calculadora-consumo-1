// ============================================================
//  LogiRuta — Bitácora de Consumo de Combustible
//  script.js
//
//  Lógica principal: registro múltiple de cargas de combustible
//  a lo largo de un viaje y cálculo del consumo total L/100km.
// ============================================================


// -----------------------------------------------------------
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
//    Vinculamos cada elemento HTML con una constante JS
//    usando getElementById para acceder a ellos fácilmente.
// -----------------------------------------------------------
const inputKm        = document.getElementById('input-km');
const inputLitros    = document.getElementById('input-litros');
const msgError       = document.getElementById('msg-error');

const btnAgregar     = document.getElementById('btn-agregar');
const btnFinalizar   = document.getElementById('btn-finalizar');
const btnNuevoViaje  = document.getElementById('btn-nuevo-viaje');

const seccionCargas   = document.getElementById('seccion-cargas');
const seccionFinalizar= document.getElementById('seccion-finalizar');
const tablaCargas     = document.getElementById('tabla-cargas');
const resultadoFinal  = document.getElementById('resultado-final');

const resDistancia   = document.getElementById('res-distancia');
const resLitros      = document.getElementById('res-litros');
const resConsumo     = document.getElementById('res-consumo');


// -----------------------------------------------------------
// 2. ALMACENAMIENTO DE CARGAS — ARRAY DE OBJETOS
//
//    Usamos un Array llamado "registros" para guardar
//    cada carga que el chofer ingresa durante el viaje.
//
//    Cada elemento del array es un OBJETO con la forma:
//    { km: number, litros: number }
//
//    Ejemplo de cómo crece el array con 3 cargas:
//    [
//      { km: 45000, litros: 50.00 },   ← primera carga (punto de inicio)
//      { km: 45500, litros: 42.50 },   ← segunda carga
//      { km: 46200, litros: 38.00 }    ← tercera carga
//    ]
//
//    Con este array podemos:
//    - Mostrar el historial en la tabla HTML.
//    - Calcular la distancia total: último km - primer km.
//    - Calcular los litros totales: suma de todos los litros.
// -----------------------------------------------------------
let registros = [];


// -----------------------------------------------------------
// 3. FUNCIÓN: mostrarError
//    Muestra un mensaje de validación visible al usuario
//    y lo oculta automáticamente a los 3 segundos.
// -----------------------------------------------------------
function mostrarError(mensaje) {
    msgError.textContent = mensaje;
    msgError.classList.remove('hidden');
    setTimeout(() => msgError.classList.add('hidden'), 3000);
}


// -----------------------------------------------------------
// 4. FUNCIÓN: renderizarTabla
//    Recorre el array "registros" y genera dinámicamente
//    una fila <tr> en la tabla HTML por cada objeto guardado.
//
//    También calcula el "parcial" (distancia entre cargas
//    consecutivas) para que el chofer pueda ver el tramo.
// -----------------------------------------------------------
function renderizarTabla() {
    // Limpiamos el contenido previo de la tabla
    tablaCargas.innerHTML = '';

    registros.forEach(function(registro, indice) {

        // Calculamos el tramo recorrido desde la carga anterior
        // La primera fila no tiene tramo, mostramos "Inicio"
        let parcial = '—';
        if (indice > 0) {
            const kmAnterior = registros[indice - 1].km;
            parcial = (registro.km - kmAnterior) + ' km';
        } else {
            parcial = 'Inicio';
        }

        // Creamos la fila con los datos del registro
        const fila = document.createElement('tr');
        fila.classList.add(
            indice % 2 === 0 ? 'bg-white' : 'bg-stone-50',
            'border-t', 'border-stone-100', 'transition'
        );

        fila.innerHTML = `
            <td class="py-3 px-5 text-gray-400 font-mono text-xs">${indice + 1}</td>
            <td class="py-3 px-5 font-medium text-gray-700">${registro.km.toLocaleString('es-AR')} km</td>
            <td class="py-3 px-5 text-gray-600">${registro.litros.toFixed(2)} L</td>
            <td class="py-3 px-5 text-green-600 text-xs font-medium">${parcial}</td>
        `;

        tablaCargas.appendChild(fila);
    });
}


// -----------------------------------------------------------
// 5. EVENTO: btn-agregar → "Agregar Carga"
//
//    Cuando el chofer presiona el botón:
//    a) Validamos que los campos no estén vacíos.
//    b) Validamos que el km ingresado sea mayor al anterior.
//    c) Creamos un nuevo objeto { km, litros }.
//    d) Lo añadimos al array "registros" con .push().
//    e) Actualizamos la tabla y limpiamos los inputs.
// -----------------------------------------------------------
btnAgregar.addEventListener('click', function() {

    // Leemos y convertimos los valores de los inputs a número flotante
    const km     = parseFloat(inputKm.value);
    const litros = parseFloat(inputLitros.value);

    // --- Validación 1: campos completos ---
    if (isNaN(km) || isNaN(litros)) {
        mostrarError('Por favor completá ambos campos antes de agregar.');
        return;
    }

    // --- Validación 2: litros deben ser positivos ---
    if (litros <= 0) {
        mostrarError('La cantidad de litros debe ser mayor a 0.');
        return;
    }

    // --- Validación 3: kilometraje creciente ---
    // Si ya hay registros, el nuevo km debe ser mayor al último registrado
    if (registros.length > 0) {
        const ultimoKm = registros[registros.length - 1].km;
        if (km <= ultimoKm) {
            mostrarError(`El kilometraje debe ser mayor al último registrado (${ultimoKm.toLocaleString('es-AR')} km).`);
            return;
        }
    }

    // --- Guardamos el nuevo registro en el array ---
    // Usamos .push() para agregar el objeto al final del array
    registros.push({ km: km, litros: litros });

    // --- Actualizamos la interfaz ---
    renderizarTabla();

    // Mostramos la sección de tabla y el botón finalizar
    // solo cuando hay al menos 2 cargas registradas
    seccionCargas.classList.remove('hidden');

    if (registros.length >= 2) {
        seccionFinalizar.classList.remove('hidden');
    }

    // Limpiamos los inputs para la siguiente carga
    inputKm.value     = '';
    inputLitros.value = '';
    inputKm.focus();
});


// -----------------------------------------------------------
// 6. EVENTO: btn-finalizar → "Finalizar Viaje y Calcular"
//
//    Calcula el consumo total del viaje usando todos los
//    registros acumulados en el array:
//
//    Fórmula:
//      distancia   = km del ÚLTIMO registro - km del PRIMERO
//      litrosTotales = SUMA de todos los litros en el array
//      consumo     = (litrosTotales / distancia) * 100
//
//    El resultado se muestra en L/100km (litros cada 100 km).
// -----------------------------------------------------------
btnFinalizar.addEventListener('click', function() {

    // Necesitamos al menos 2 registros para tener distancia
    if (registros.length < 2) {
        mostrarError('Necesitás al menos 2 cargas para calcular el consumo.');
        return;
    }

    // Extraemos el primer y último km del array
    const kmInicial = registros[0].km;
    const kmFinal   = registros[registros.length - 1].km;

    // Calculamos la distancia total del viaje
    const distanciaTotal = kmFinal - kmInicial;

    // Sumamos todos los litros usando .reduce()
    // .reduce() recorre el array acumulando un valor
    // "suma" arranca en 0, y en cada vuelta le suma los litros del registro actual
    const litrosTotales = registros.reduce(function(suma, registro) {
        return suma + registro.litros;
    }, 0);

    // Fórmula de consumo: L / 100km
    const consumo = (litrosTotales / distanciaTotal) * 100;

    // --- Mostramos los resultados en el HTML ---
    resDistancia.textContent = distanciaTotal.toLocaleString('es-AR');
    resLitros.textContent    = litrosTotales.toFixed(2);
    resConsumo.textContent   = consumo.toFixed(2);

    resultadoFinal.classList.remove('hidden');

    // Hacemos scroll suave hacia el resultado
    resultadoFinal.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


// -----------------------------------------------------------
// 7. EVENTO: btn-nuevo-viaje → Reiniciar la aplicación
//
//    Vaciamos el array "registros", ocultamos las secciones
//    y dejamos la app lista para un nuevo viaje.
// -----------------------------------------------------------
btnNuevoViaje.addEventListener('click', function() {

    // Vaciamos el array de registros asignando un array vacío
    registros = [];

    // Limpiamos la tabla y los inputs
    tablaCargas.innerHTML = '';
    inputKm.value         = '';
    inputLitros.value     = '';

    // Ocultamos las secciones que no deben verse al inicio
    seccionCargas.classList.add('hidden');
    seccionFinalizar.classList.add('hidden');
    resultadoFinal.classList.add('hidden');
    msgError.classList.add('hidden');

    // Hacemos scroll hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
    inputKm.focus();
});
