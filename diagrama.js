class Persona {
    constructor(id, nombre, apellido, fechaNacimiento) {
        this.id = id;
        this.setNombre(nombre);
        this.setApellido(apellido);
        this.setFechaNacimiento(fechaNacimiento);
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

    setFechaNacimiento(fechaNacimiento) {
        let fechaNacimientoSet = fechaNacimiento;
        if (!Number.isInteger(fechaNacimientoSet)) {
            fechaNacimientoSet = parseInt(fechaNacimientoSet);
        }
        if (!isNaN(fechaNacimientoSet) && typeof fechaNacimientoSet === 'number' && fechaNacimientoSet >= 10000101 && fechaNacimientoSet <= 99991231) {
            this.fechaNacimiento = fechaNacimientoSet;
        } else {
            throw new Error("Error: La fecha de nacimiento debe ser un número entero con formato AAAAMMDD.");
        }
    }
    

    toString() {
        let string = "Id: " + this.id.toString() + "\n";
        string += "Nombre: " + this.nombre + "\n";
        string += "Apellido: " + this.apellido + "\n";
        string += "Fecha de nacimiento: " + this.fechaNacimiento.toString();
        return string;
        }
}

class Ciudadano extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, dni) {
        super(id, nombre, apellido, fechaNacimiento);
        this.setDni(dni);
    }

    setDni(dni) {
        let dniSet = dni;
        if (!Number.isInteger(dniSet)) {
            dniSet = parseInt(dniSet);
        }

        if (!isNaN(dniSet) && dniSet > 0 && typeof dniSet === 'number') {
            this.dni = dniSet;
        } else {
            throw new Error("Error. El numero es menor a 0, no puedes");
        }
    }

    toString() {
        let mensaje = super.toString();
        mensaje += "\nDni: " + this.dni.toString() + "\n";
        return mensaje;
    }
}

class Extranjero extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
        super(id, nombre, apellido, fechaNacimiento);
        this.setPaisOrigen(paisOrigen);
    }

    setPaisOrigen(paisOrigen) {
        if (typeof paisOrigen === "string" && paisOrigen !== "") {
            this.paisOrigen = paisOrigen;
        } else {
            throw new Error("Error. No estas agregando un apellido correcto");
        }
    }


    toString() {
        let mensaje = super.toString();
        mensaje += "\nPaisOrigen: " + this.paisOrigen + "\n";
        return mensaje;
    }
}

const claves = ['id', 'nombre', 'apellido', 'fechaNacimiento', 'dni', 'paisOrigen'];
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

    http.open("GET", "https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero", true);
    http.send();
}


function generarLista(data) {
    personas = [];
    for (let item of data) {
        if (item.dni) {
            personas.push(new Ciudadano(item.id, item.nombre, item.apellido, item.fechaNacimiento, item.dni));
        } else if (item.paisOrigen) {
            personas.push(new Extranjero(item.id, item.nombre, item.apellido, item.fechaNacimiento, item.paisOrigen));
        }
    }
}

function mostrarFormularioLista() {
    const formDatos = document.getElementById("form-datos");
    const formAgregar = document.getElementById("form-agregar");
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

        const fechaNacimientoCell = document.createElement("td");
        fechaNacimientoCell.textContent = persona.fechaNacimiento;
        row.appendChild(fechaNacimientoCell);

        const dniCell = document.createElement("td");
        dniCell.textContent = persona instanceof Ciudadano ? persona.dni : "-";
        row.appendChild(dniCell);

        const paisOrigenCell = document.createElement("td");
        paisOrigenCell.textContent = persona instanceof Extranjero ? persona.paisOrigen : "-";
        row.appendChild(paisOrigenCell);

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

    formDatos.style.display = "block";
    formAgregar.style.display = "none";
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
    document.getElementById("txt-fechaNacimiento").value = "";
    document.getElementById("txt-dni").value = "";
    document.getElementById("txt-paisOrigen").value = "";

    select_tipo.disabled = false;
    btn_agregar.hidden = false;
    div_id.hidden = true;
    btn_eliminar.hidden = true;
    btn_modificar.hidden = true;

    SetTipo(select_tipo.value);
}

async function Agregar() {
    const spinner = document.getElementById("spinner");
    const formulario_agregar = document.getElementById("form-agregar");
    const formulario_datos = document.getElementById("form-datos");
    
    spinner.style.display = "block";
    try {
        let nuevoPersona;
        const nombre = document.getElementById("txt-nombre").value;
        const apellido = document.getElementById("txt-apellido").value;
        const fechaNacimiento = document.getElementById("txt-fechaNacimiento").value;
        const tipo = document.getElementById("select-tipo").value;
        let id = ObtenerProximoId(personas);

        if (tipo === "ciudadano") {
            const dni = document.getElementById("txt-dni").value;
            nuevoPersona = new Ciudadano(null, nombre, apellido, fechaNacimiento, dni);
        } else if (tipo === "extranjero") {
            const paisOrigen = document.getElementById("txt-paisOrigen").value;
            nuevoPersona = new Extranjero(null, nombre, apellido, fechaNacimiento, paisOrigen);
        }

        const response = await fetch("https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nuevoPersona.nombre,
                apellido: nuevoPersona.apellido,
                fechaNacimiento: nuevoPersona.fechaNacimiento,
                dni: nuevoPersona instanceof Ciudadano ? nuevoPersona.dni : undefined,
                paisOrigen: nuevoPersona instanceof Extranjero ? nuevoPersona.paisOrigen : undefined
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
        formulario_datos.style.display = "block"
        formulario_agregar.style.display = "none"
        alert("La persona se ha agregado correctamente");
    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        spinner.style.display = "none";
    }
}


function Modificar() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";
    
    const id = document.getElementById("txt-id").value;
    const nombre = document.getElementById("txt-nombre").value;
    const apellido = document.getElementById("txt-apellido").value;
    const fechaNacimiento = document.getElementById("txt-fechaNacimiento").value;
    const dni = document.getElementById("txt-dni").value;
    const paisOrigen = document.getElementById("txt-paisOrigen").value;

    const personaModificada = {
        id: id,
        nombre: nombre,
        apellido: apellido,
        fechaNacimiento: fechaNacimiento
    };

    if (dni) {
        personaModificada.dni = dni;
    } else if (paisOrigen) {
        personaModificada.paisOrigen = paisOrigen;
    }

    fetch('https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(personaModificada)
    })
    .then(response => {
        spinner.style.display = "none";
        if (response.status === 200) {
            // Asegurar que el ID es un número para la comparación
            const index = personas.findIndex(p => p.id == id);
            if (index !== -1) {
                // Actualizar la persona en la lista
                personas[index] = personaModificada;
                mostrarFormularioLista();
            } else {
                alert("No se encontró la persona en la lista.");
            }
        } else {
            alert("No se pudo realizar la operación, El usuario no se puede modificar.");
            mostrarFormularioLista();
        }
    })
    .catch(error => {
        spinner.style.display = "none";
        alert("Ocurrió un error: " + error.message);
    });
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
    document.getElementById("txt-fechaNacimiento").value = persona.fechaNacimiento;
    
    if (persona instanceof Ciudadano) {
        document.getElementById("txt-dni").value = persona.dni;
        selectTipo.value = "ciudadano";
        SetTipo("ciudadano");
    } else if (persona instanceof Extranjero) {
        document.getElementById("txt-paisOrigen").value = persona.paisOrigen;
        selectTipo.value = "extranjero";
        SetTipo("extranjero");
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
        const response = await fetch("https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero", {
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
    document.getElementById("txt-fechaNacimiento").value = persona.fechaNacimiento;
    
    if (persona instanceof Ciudadano) {
        document.getElementById("txt-dni").value = persona.dni;
        selectTipo.value = "ciudadano";
        SetTipo("ciudadano");
    } else if (persona instanceof Extranjero) {
        document.getElementById("txt-paisOrigen").value = persona.paisOrigen;
        selectTipo.value = "extranjero";
        SetTipo("extranjero");
    }

    selectTipo.disabled = true;
    btnAgregar.hidden = true;
    btnModificar.hidden = false;
    btnEliminar.hidden = true;
    divId.hidden = false;

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

        const fechaNacimientoCell = document.createElement("td");
        fechaNacimientoCell.textContent = persona.fechaNacimiento;
        row.appendChild(fechaNacimientoCell);

        const dniCell = document.createElement("td");
        dniCell.textContent = persona instanceof Ciudadano ? persona.dni : "-";
        row.appendChild(dniCell);


        const paisOrigenCell = document.createElement("td");
        paisOrigenCell.textContent = persona instanceof Extranjero ? persona.paisOrigen : "-";
        row.appendChild(paisOrigenCell);

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
    const input_dni = document.getElementById("div-dni");
    const input_paisOrigen = document.getElementById("div-paisOrigen");
    const input_compras = document.getElementById("div-compras");
    const input_telefono = document.getElementById("div-telefono");
    if (tipo == "ciudadano")
    {
        
        input_dni.hidden = false;
        input_paisOrigen.hidden = true;

    }
    else
    {
        input_dni.hidden = true;
        input_paisOrigen.hidden = false;

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

document.getElementById("btn-modificar").addEventListener("click", (event) => {
    event.preventDefault();
    Modificar();
});

const select_tipo = document.getElementById("select-tipo");
select_tipo.addEventListener("change", (e)=>{SetTipo(select_tipo.value)});


function ObtenerProximoId(personas) {
    let maxId = 0;
    for (let persona of personas) {
        maxId++;
    }
    return maxId;
}