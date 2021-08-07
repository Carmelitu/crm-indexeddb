(function() {
    let DB;

    const nombreInput = document.querySelector('#nombre');
    const telefonoInput = document.querySelector('#telefono');
    const emailInput = document.querySelector('#email');
    const empresaInput = document.querySelector('#empresa');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        // Verificar id URL con QueryString
        const parametrosURL = new URLSearchParams(window.location.search);

        const idCliente = parametrosURL.get('id');

        if (idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);            
        }
        
    });

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

    function llenarFormulario(cliente){
        const {nombre, email, telefono, empresa} = cliente;

        nombreInput.value = nombre;
        telefonoInput.value = telefono;
        emailInput.value = email;
        empresaInput.value = empresa;

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
})()