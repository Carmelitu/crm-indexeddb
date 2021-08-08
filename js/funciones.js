function crearDB(){
    var crearDB = window.indexedDB.open('crm', 1);

    crearDB.onerror = () => {
        console.log('Error al crear DB');
    }

    crearDB.onsuccess = () => {
        DB = crearDB.result;            
    }


    crearDB.onupgradeneeded = (e) => {
        const db = e.target.result;

        const objectStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement: true});

        objectStore.createIndex('nombre', 'nombre', {unique: false});
        objectStore.createIndex('email', 'email', {unique: true});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('empresa', 'empresa', {unique: false});
        objectStore.createIndex('id', 'id', {unique: true});

        console.log('DB Lista y creada');
    }
}

function conectarDB(){
    const abrirConexion = window.indexedDB.open('crm', 1);

    abrirConexion.onerror = () => {
        console.log('Error al abrir DB');
    }

    abrirConexion.onsuccess = () => {
        DB = abrirConexion.result;
    }
}

function imprimirAlerta(mensaje, tipo){
    const alerta = document.querySelector('.alerta');
    
    if (!alerta){        
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

        if (tipo === 'error'){
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700')
        }

        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function obtenerCliente(id){
    const transaction = DB.transaction(['crm'], 'readonly');
    const objectStore = transaction.objectStore('crm');

    const cliente = objectStore.openCursor();
    cliente.onsuccess = (e) => {
        const cursor = e.target.result;

        if (cursor) {
            if (cursor.value.id === Number(id)){
                llenarFormulario(cursor.value);
            }
            cursor.continue();
        }
    }
}

function eliminarRegistro(e){
    if (e.target.classList.contains('eliminar')){
        const idEliminar = Number(e.target.dataset.cliente);
        const confirmar = confirm('Deseas eliminar este cliente?');

        if (confirmar){
            const transaction = DB.transaction(['crm'], 'readwrite');
            const objectStore = transaction.objectStore('crm');

            objectStore.delete(idEliminar);

            transaction.oncomplete = () => {
                console.log('Cliente eliminado correctamente');

                e.target.parentElement.parentElement.remove();
            }

            transaction.onerror = () => {
                console.log('Hubo un error', 'error');
            }
        }
    }
}