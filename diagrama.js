class Persona {
    constructor(id, nombre, apellido, edad) {
        this.id = id;
        this.setNombre(nombre);
        this.setApellido(apellido);
        this.setEdad(edad);
    }

    setNombre(nombre) {
        if (typeof nombre === "string" && nombre !== "") {
            this.nombre = nombre;
        } else {
            throw new Error("Error. No estas agregando un nombre correcto");
        }
    }

    setApellido(apellido) {
        if (typeof apellido === "string" && apellido !== "") {
            this.apellido = apellido;
        } else {
            throw new Error("Error. No estas agregando un apellido correcto");
        }
    }

    setEdad(edad) {
        let edadSet = edad;
        if (!Number.isInteger(edadSet)) {
            edadSet = parseInt(edadSet);
        }
        if (!isNaN(edadSet) && typeof edadSet === 'number' && edadSet > 15) {
            this.edad = edadSet;
        } else {
            throw new Error("Error: La edad no se paso correctamente.");
        }
    }

    toString() {
        let string = "Id: " + this.id.toString() + "\n";
        string += "Nombre: " + this.nombre + "\n";
        string += "Apellido: " + this.apellido + "\n";
        string += "Edad: " + this.edad.toString();
        return string;
    }
}

class Empleado extends Persona {
    constructor(id, nombre, apellido, edad, ventas, sueldo) {
        super(id, nombre, apellido, edad);
        this.setVentas(ventas);
        this.setSueldo(sueldo);
    }

    setVentas(ventas) {
        let ventasSet = ventas;
        if (!Number.isInteger(ventasSet)) {
            ventasSet = parseInt(ventasSet);
        }

        if (!isNaN(ventasSet) && ventasSet > 0 && typeof ventasSet === 'number') {
            this.ventas = ventasSet;
        } else {
            throw new Error("Error. El numero es menor a 0, no puedes");
        }
    }

    setSueldo(sueldo) {
        let sueldoSet = sueldo;
        if (!Number.isInteger(sueldoSet)) {
            sueldoSet = parseInt(sueldoSet);
        }

        if (!isNaN(sueldoSet) && sueldoSet > 0 && typeof sueldoSet === 'number') {
            this.sueldo = sueldoSet;
        } else {
            throw new Error("Error. El numero es menor a 0, no puedes");
        }
    }

    toString() {
        let mensaje = super.toString();
        mensaje += "\nVentas: " + this.ventas.toString() + "\n";
        mensaje += "\nSueldo: " + this.sueldo.toString() + "\n";
        return mensaje;
    }
}

class Cliente extends Persona {
    constructor(id, nombre, apellido, edad, compras, telefono) {
        super(id, nombre, apellido, edad);
        this.setCompras(compras);
        this.setTelefono(telefono);
    }

    setCompras(compras) {
        let comprasSet = compras;
        if (!Number.isInteger(comprasSet)) {
            comprasSet = parseInt(comprasSet);
        }

        if (!isNaN(comprasSet) && comprasSet > 0 && typeof comprasSet === 'number') {
            this.compras = comprasSet;
        } else {
            throw new Error("Error. El numero es menor a 0, no puedes");
        }
    }

    setTelefono(telefono) {
        if (typeof telefono === "string" && telefono !== "") {
            this.telefono = telefono;
        } else {
            throw new Error("Error. No estas agregando un apellido correcto");
        }
    }

    toString() {
        let mensaje = super.toString();
        mensaje += "\nTelefono: " + this.telefono + "\n";
        mensaje += "\nCompras: " + this.compras.toString() + "\n";
        return mensaje;
    }
}

const claves = ['id', 'nombre', 'apellido', 'edad', 'ventas', 'sueldo', 'compras', 'telefono'];
let personas = [];


function cargarDatos() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";
    const formDatos = document.getElementById("form-datos");
    formDatos.style.display = "none";


    let http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (http.readyState === 4) {
            spinner.style.display = "none";
            formDatos.style.display = "block";

            if (http.status === 200) {
                try {
                    console.log("Response received:", http.responseText);
                    let arrayRespuesta = JSON.parse(http.responseText);
                    generarLista(arrayRespuesta);
                    mostrarFormularioLista();
                } catch (e) {
                    alert("Error procesando la respuesta: " + e.message);
                }
            } else {
                alert("No se pudo acceder al endpoint. Verifica la URL o la ubicación del servidor.");
            }
        }
    };

    http.open("GET", "http://localhost/PersonasEmpleadosClientes.php", true);
    http.send();
}


function generarLista(data) {
    personas = [];
    for (let item of data) {
        if (item.ventas && item.sueldo) {
            personas.push(new Empleado(item.id, item.nombre, item.apellido, item.edad, item.ventas, item.sueldo));
        } else if (item.compras && item.telefono) {
            personas.push(new Cliente(item.id, item.nombre, item.apellido, item.edad, item.compras, item.telefono));
        }
    }
}

function mostrarFormularioLista() {
    const formDatos = document.getElementById("form-datos");
    const tUserBody = document.getElementById("t-user-body");

    tUserBody.innerHTML = "";

    for (let persona of personas) {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = persona.id;
        row.appendChild(idCell);

        const nombreCell = document.createElement("td");
        nombreCell.textContent = persona.nombre;
        row.appendChild(nombreCell);

        const apellidoCell = document.createElement("td");
        apellidoCell.textContent = persona.apellido;
        row.appendChild(apellidoCell);

        const edadCell = document.createElement("td");
        edadCell.textContent = persona.edad;
        row.appendChild(edadCell);

        const ventasCell = document.createElement("td");
        ventasCell.textContent = persona instanceof Empleado ? persona.ventas : "-";
        row.appendChild(ventasCell);

        const sueldoCell = document.createElement("td");
        sueldoCell.textContent = persona instanceof Empleado ? persona.sueldo : "-";
        row.appendChild(sueldoCell);

        const comprasCell = document.createElement("td");
        comprasCell.textContent = persona instanceof Cliente ? persona.compras : "-";
        row.appendChild(comprasCell);

        const telefonoCell = document.createElement("td");
        telefonoCell.textContent = persona instanceof Cliente ? persona.telefono : "-";
        row.appendChild(telefonoCell);

        // Botón Modificar
        const modificarCell = document.createElement("td");
        const modificarButton = document.createElement("button");
        modificarButton.textContent = "Modificar";
        modificarButton.addEventListener("click", (event) => {
            event.preventDefault(); 
            MostrarModificar(persona);
        });
        modificarCell.appendChild(modificarButton);
        row.appendChild(modificarCell);

        // Botón Eliminar
        const eliminarCell = document.createElement("td");
        const eliminarButton = document.createElement("button");
        eliminarButton.textContent = "Eliminar";
        eliminarButton.addEventListener("click", (event) => {
            event.preventDefault(); 
            MostrarEliminar(persona);
        });
        eliminarCell.appendChild(eliminarButton);
        row.appendChild(eliminarCell);

        tUserBody.appendChild(row);
    }

    formDatos.hidden = false;
}

function vaciar(elemento)
{
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function MostrarPersonas(personas) {
    row_index = 1;

    const tabla_personas_body = document.getElementById("t-user-body");
    vaciar(tabla_personas_body);
    let text_col;
    let col;
    let txt_col_node;
    let row;
    for (let persona of personas) {
        row = document.createElement("tr");

        for (let clave of claves) {
            if(persona[clave] !== undefined)
            {
                text_col = persona[clave];
            }else{
                text_col = "-"
            }
            txt_col_node = document.createTextNode(text_col);
            col = document.createElement("td");
            col.appendChild(txt_col_node);
            row.appendChild(col);
        }
    }
}


function MostrarAgregar() {
    const formulario_datos = document.getElementById("form-datos");
    const formulario_agregar = document.getElementById("form-agregar");

    formulario_datos.style.display = "none";
    formulario_agregar.style.display = "block";

    const btn_modificar = document.getElementById("btn-modificar");
    const btn_agregar = document.getElementById("btn-agregar");
    const btn_eliminar = document.getElementById("btn-eliminar");

    const div_id = document.getElementById("div-id");
    const select_tipo = document.getElementById("select-tipo");

    document.getElementById("txt-id").value = "";
    document.getElementById("txt-nombre").value = "";
    document.getElementById("txt-apellido").value = "";
    document.getElementById("txt-edad").value = "";
    document.getElementById("txt-ventas").value = "";
    document.getElementById("txt-sueldo").value = "";
    document.getElementById("txt-compras").value = "";
    document.getElementById("txt-telefono").value = "";

    select_tipo.disabled = false;
    btn_agregar.hidden = false;
    div_id.hidden = true;
    btn_eliminar.hidden = true;
    btn_modificar.hidden = true;

    SetTipo(select_tipo.value);
}


async function Agregar() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";
    try {
        let nuevoPersona;
        const nombre = document.getElementById("txt-nombre").value;
        const apellido = document.getElementById("txt-apellido").value;
        const edad = document.getElementById("txt-edad").value;
        let id = ObtenerProximoId(personas);

        const tipo = document.getElementById("select-tipo").value;

        if (tipo === "empleado") {
            const ventas = document.getElementById("txt-ventas").value;
            const sueldo = document.getElementById("txt-sueldo").value;
            nuevoPersona = new Empleado(id, nombre, apellido, edad, ventas, sueldo);
        } else if (tipo === "cliente") {
            const compras = document.getElementById("txt-compras").value;
            const telefono = document.getElementById("txt-telefono").value;
            nuevoPersona = new Cliente(id, nombre, apellido, edad, compras, telefono);
        }

        const response = await fetch("http://localhost/PersonasEmpleadosClientes.php", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nuevoPersona.nombre,
                apellido: nuevoPersona.apellido,
                edad: nuevoPersona.edad,
                ventas: nuevoPersona instanceof Empleado ? nuevoPersona.ventas : undefined,
                sueldo: nuevoPersona instanceof Empleado ? nuevoPersona.sueldo : undefined,
                compras: nuevoPersona instanceof Cliente ? nuevoPersona.compras : undefined,
                telefono: nuevoPersona instanceof Cliente ? nuevoPersona.telefono : undefined
            })
        });
        
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();
        
        nuevoPersona.id = id;
        personas.push(nuevoPersona);
        ActualizarTabla();
        mostrarFormularioLista();
        const formulario_datos = document.getElementById("form-datos");
        const formulario_agregar = document.getElementById("form-agregar");
        formulario_datos.hidden = false;
        formulario_agregar.hidden = true;
        alert("La persona se ha agregado correctamente");
    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        spinner.style.display = "none";
    }
}


async function Modificar(persona) {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";

    try {
        const id = document.getElementById("txt-id").value;
        const nombre = document.getElementById("txt-nombre").value;
        const apellido = document.getElementById("txt-apellido").value;
        const edad = document.getElementById("txt-edad").value;
        const tipo = document.getElementById("select-tipo").value;

        let ventas, sueldo, compras, telefono;
        if (tipo === "empleado") {
            ventas = document.getElementById("txt-ventas").value;
            sueldo = document.getElementById("txt-sueldo").value;
        } else if (tipo === "cliente") {
            compras = document.getElementById("txt-compras").value;
            telefono = document.getElementById("txt-telefono").value;
        }

        const response = await fetch("http://localhost/PersonasEmpleadosClientes.php", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: persona.id,
                nombre: nombre,
                apellido: apellido,
                edad: edad,
                ventas: ventas,
                sueldo: sueldo,
                compras: compras,
                telefono: telefono
            })
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();

        persona.setNombre(nombre);
        persona.setApellido(apellido);
        persona.setEdad(edad);
        if (tipo === "empleado") {
            persona.setVentas(ventas);
            persona.setSueldo(sueldo);
        } else if (tipo === "cliente") {
            persona.setCompras(compras);
            persona.setTelefono(telefono);
        }

        ActualizarTabla();
        mostrarFormularioLista();
        alert("La persona se ha modificado correctamente");

        // Ocultar el formulario de agregar
        document.getElementById("form-agregar").style.display= "none";
        // Mostrar el formulario de datos
        document.getElementById("form-datos").style.display= "block";

    } catch (error) {
        mostrarFormularioLista();
        alert("Error: " + error.message);
    } finally {
        spinner.style.display = "none"; 
    }
}

function Cancelar() {
    const formDatos = document.getElementById("form-datos");
    const formAgregar = document.getElementById("form-agregar");

    formDatos.hidden = false;
    formAgregar.hidden = true;
}


function MostrarEliminar(persona) {
    const formDatos = document.getElementById("form-datos");
    const formAgregar = document.getElementById("form-agregar");

    formDatos.style.display = "none";
    formAgregar.style.display = "block";

    const btnAgregar = document.getElementById("btn-agregar");
    const btnModificar = document.getElementById("btn-modificar");
    const btnEliminar = document.getElementById("btn-eliminar");
    const btnCancelar = document.getElementById("btn-cancelar");

    const divId = document.getElementById("div-id");
    const selectTipo = document.getElementById("select-tipo");

    document.getElementById("txt-id").value = persona.id;
    document.getElementById("txt-nombre").value = persona.nombre;
    document.getElementById("txt-apellido").value = persona.apellido;
    document.getElementById("txt-edad").value = persona.edad;
    
    if (persona instanceof Empleado) {
        document.getElementById("txt-ventas").value = persona.ventas;
        document.getElementById("txt-sueldo").value = persona.sueldo;
        selectTipo.value = "empleado";
        SetTipo("empleado");
    } else if (persona instanceof Cliente) {
        document.getElementById("txt-compras").value = persona.compras;
        document.getElementById("txt-telefono").value = persona.telefono;
        selectTipo.value = "cliente";
        SetTipo("cliente");
    }

    selectTipo.disabled = true;
    btnAgregar.hidden = true;
    btnModificar.hidden = true;
    btnEliminar.hidden = false;
    divId.hidden = false;

    // Eliminar eventos anteriores para evitar duplicados
    const eliminarClickHandler = () => Eliminar(persona.id);
    btnEliminar.removeEventListener("click", eliminarClickHandler);
    btnEliminar.addEventListener("click", eliminarClickHandler);
    
    btnCancelar.removeEventListener("click", Cancelar);
    btnCancelar.addEventListener("click", Cancelar);
}




async function Eliminar(id) {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";

    try {
        const response = await fetch("http://localhost/PersonasEmpleadosClientes.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id })
        });

        if (!response.ok) {
            if(id == 666){
                MostrarDatos();
                throw new Error('No puedes eliminar a esta persona');
            }
            throw new Error('Error en la solicitud');
        }

        // Elimina la persona de la lista local
        personas = personas.filter(persona => persona.id !== id);
        ActualizarTabla();
        mostrarFormularioLista();
        MostrarDatos();
        alert("La persona se ha eliminado correctamente");
    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        spinner.style.display = "none"; 
    }
}

function EliminarTodosLosEventos(elemento) {
    const copiaElemento = elemento.cloneNode(true);
    elemento.parentNode.replaceChild(copiaElemento, elemento);
    return copiaElemento;
}

function MostrarModificar(persona) {
    const formDatos = document.getElementById("form-datos");
    const formAgregar = document.getElementById("form-agregar");

    formDatos.style.display = "none";
    formAgregar.style.display = "block";

    const btnAgregar = document.getElementById("btn-agregar");
    const btnModificar = document.getElementById("btn-modificar");
    const btnEliminar = document.getElementById("btn-eliminar");
    const btnCancelar = document.getElementById("btn-cancelar");

    const divId = document.getElementById("div-id");
    const selectTipo = document.getElementById("select-tipo");

    document.getElementById("txt-id").value = persona.id;
    document.getElementById("txt-nombre").value = persona.nombre;
    document.getElementById("txt-apellido").value = persona.apellido;
    document.getElementById("txt-edad").value = persona.edad;
    
    if (persona instanceof Empleado) {
        document.getElementById("txt-ventas").value = persona.ventas;
        document.getElementById("txt-sueldo").value = persona.sueldo;
        selectTipo.value = "empleado";
        SetTipo("empleado");
    } else if (persona instanceof Cliente) {
        document.getElementById("txt-compras").value = persona.compras;
        document.getElementById("txt-telefono").value = persona.telefono;
        selectTipo.value = "cliente";
        SetTipo("cliente");
    }

    selectTipo.disabled = true;
    btnAgregar.hidden = true;
    btnModificar.hidden = false;
    btnEliminar.hidden = true;
    divId.hidden = false;


    // Eliminar eventos anteriores para evitar duplicados
    btnModificar.removeEventListener("click", () => Modificar(persona));
    btnModificar.addEventListener("click", () => Modificar(persona));
    btnCancelar.removeEventListener("click", () => Cancelar());
    btnCancelar.addEventListener("click", () => Cancelar());
}



function MostrarDatos()
{
    const formulario_datos = document.getElementById("form-datos");
    const formulario_agregar = document.getElementById("form-agregar");
    formulario_datos.style.display = "block";
    formulario_agregar.style.display = "none";
}

function ActualizarTabla() {
    const tUserBody = document.getElementById("t-user-body");
    tUserBody.innerHTML = "";

    for (let persona of personas) {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = persona.id;
        row.appendChild(idCell);

        const nombreCell = document.createElement("td");
        nombreCell.textContent = persona.nombre;
        row.appendChild(nombreCell);

        const apellidoCell = document.createElement("td");
        apellidoCell.textContent = persona.apellido;
        row.appendChild(apellidoCell);

        const edadCell = document.createElement("td");
        edadCell.textContent = persona.edad;
        row.appendChild(edadCell);

        const ventasCell = document.createElement("td");
        ventasCell.textContent = persona instanceof Empleado ? persona.ventas : "-";
        row.appendChild(ventasCell);

        const sueldoCell = document.createElement("td");
        sueldoCell.textContent = persona instanceof Empleado ? persona.sueldo : "-";
        row.appendChild(sueldoCell);

        const comprasCell = document.createElement("td");
        comprasCell.textContent = persona instanceof Cliente ? persona.compras : "-";
        row.appendChild(comprasCell);

        const telefonoCell = document.createElement("td");
        telefonoCell.textContent = persona instanceof Cliente ? persona.telefono : "-";
        row.appendChild(telefonoCell);

        // Botón Modificar
        const modificarCell = document.createElement("td");
        const modificarButton = document.createElement("button");
        modificarButton.textContent = "Modificar";
        modificarButton.addEventListener("click", () => MostrarModificar(persona));
        modificarCell.appendChild(modificarButton);
        row.appendChild(modificarCell);

        // Botón Eliminar
        const eliminarCell = document.createElement("td");
        const eliminarButton = document.createElement("button");
        eliminarButton.textContent = "Eliminar";
        eliminarButton.addEventListener("click", () => Eliminar(persona.id));
        eliminarCell.appendChild(eliminarButton);
        row.appendChild(eliminarCell);

        tUserBody.appendChild(row);
    }
}

function MostrarColumna(indiceColumna) {
    const tabla = document.getElementById("table-datos");
    const filas = tabla.getElementsByTagName("tr");
    
    for (let i = 0; i < filas.length; i++) {
    const celdas = filas[i].querySelectorAll("td, th");
    if (celdas.length > indiceColumna) {
        celdas[indiceColumna].style.display = "";
    }
    }
}



function OcultarColumna(indiceColumna) {
    const tabla = document.getElementById("table-datos");
    const filas = tabla.getElementsByTagName("tr");
    
    for (let i = 0; i < filas.length; i++) {
    const celdas = filas[i].querySelectorAll("td, th");
    if (celdas.length > indiceColumna) {
        celdas[indiceColumna].style.display = "none";
    }
    }
}

function SetTipo(tipo)
{
    const input_ventas = document.getElementById("div-ventas");
    const input_sueldo = document.getElementById("div-sueldo");
    const input_compras = document.getElementById("div-compras");
    const input_telefono = document.getElementById("div-telefono");
    if (tipo == "empleado")
    {
        
        input_ventas.hidden = false;
        input_sueldo.hidden = false;
        input_compras.hidden = true;
        input_telefono.hidden = true;
    }
    else
    {
        input_ventas.hidden = true;
        input_sueldo.hidden = true;
        input_compras.hidden = false;
        input_telefono.hidden = false;
    }
}


window.addEventListener("load", () => {
cargarDatos()
});



const btn_mostrar_agregar = document.getElementById("btn-mostrar-agregar");
btn_mostrar_agregar.addEventListener("click", (e) => {
    e.preventDefault();
    MostrarAgregar();
});

const formulario_datos = document.getElementById("form-datos");

const btn_cancelar = document.getElementById("btn-cancelar");
btn_cancelar.addEventListener("click", (e) => {
    e.preventDefault();
    MostrarDatos();
});

const btn_agregar = document.getElementById("btn-agregar");
btn_agregar.addEventListener("click", (e) => {
    e.preventDefault();
    Agregar();

});


let t_head;
for (let clave of claves)
{
    t_head = document.getElementById("t-head-" + clave);
    t_head.addEventListener("click", () => {
        personas.sort((a, b) => a[clave] - b[clave]);
        ActualizarTabla();
    });
}


for (let i = 0; i < claves.length; i++)
    {
        let clave = claves[i];
        let checkbox = document.getElementById(clave + "Check");
        checkbox.checked = true;
        checkbox.addEventListener("change", function() {
            if (this.checked) {
                MostrarColumna(i);
            } else {
                OcultarColumna(i);
            }
        });
    }



const select_tipo = document.getElementById("select-tipo");
select_tipo.addEventListener("change", (e)=>{SetTipo(select_tipo.value)});


function ObtenerProximoId(personas) {
    let maxId = 0;
    for (let persona of personas) {
        maxId++;
    }
    return maxId;
}