import {
  cargarDatosCliente,
  listadoClientes,
  mostrarNuevoCliente,
} from "./funciones.js";
let db;

init();

export function init() {
  const request = indexedDB.open("clientesDb", 1);

  // Crear y actualizar base de datos si es necesario
  request.onupgradeneeded = (event) => {
    db = event.target.result;
    const store = db.createObjectStore("clientes", { keyPath: "email" });
    store.createIndex("email", "email", { unique: true });
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    list(); // Listar clientes al cargar la base de datos
  };
  
  request.onerror = (event) => {
    console.error("Error al abrir la base de datos:", event.target.error);
  };
  return request  
}

export function list() {
  const tx = db.transaction("clientes", "readonly");
  const store = tx.objectStore("clientes");

  const request = store.getAll();

  request.onsuccess = (event) => {
    const clientes = event.target.result;

    // Actualiza la lista solo si hay clientes
    if (clientes.length) {
      mostrarNuevoCliente(clientes); // Muestra los clientes en la tabla
    } else {
      listadoClientes.innerHTML +=
        '<tr><td colspan="4">Añade más clientes a la base de datos.</td></tr>';
    }
  };

  request.onerror = (event) => {
    console.error("Error al listar clientes:", event.target.error);
  };
}


export function addCliente(nombre, email, telefono, empresa) {
  const tx = db.transaction("clientes", "readwrite");
  const store = tx.objectStore("clientes");

  const request = store.add({ nombre, email, telefono, empresa });

  request.onsuccess = () => {
    list(); // Llama a list() para actualizar la lista después de añadir cliente
  };

  request.onerror = (event) => {
    if (event.target.error.name === "ConstraintError") {
      alert("Ese cliente ya existe.");
    } else {
      console.error("Error al añadir cliente:", event.target.error);
    }
  };
}

export function editCliente( nombre, email, telefono, empresa ) {
  const tx = db.transaction("clientes", "readwrite");
  const store = tx.objectStore("clientes");

  const request = store.put({ nombre, email, telefono, empresa });
  request.onsuccess = () => {
    list(); // Llama a list() para actualizar la lista después de añadir cliente
  };

  request.onerror = (event) => {
    if (event.target.error.name === "ConstraintError") {
      alert("No se pudo actualizar");
    } else {
      console.error("Error al actualizar cliente:", event.target.error);
    }
  };
}

export function borrarCliente(email) {
  const tx = db.transaction("clientes", "readwrite");
  const store = tx.objectStore("clientes");

  const request = store.delete(email);
  request.onsuccess = () => {
    list(); // Llama a list() para actualizar la lista después de añadir cliente
  };

  request.onerror = (event) => {
    if (event.target.error.name === "ConstraintError") {
      alert("No se pudo actualizar");
    } else {
      console.error("Error al actualizar cliente:", event.target.error);
    }
  };
}

export function obtenerCliente(email) {
  const tx = db.transaction("clientes", "readonly");
  const store = tx.objectStore("clientes");
  const request = store.get(email);
  
  request.onsuccess = () => {
    list(); // Listar clientes al cargar la base de datos
  };
  request.onerror = (event) => {
    if (event.target.error.name === "ConstraintError") {
      alert("No se encontró el cliente");
    } else {
      console.error("Error al actualizar cliente:", event.target.error);
    }
  };
  return request;
}

window.addEventListener("unhandledrejection", (event) => {
  alert("Error: " + event.reason.message);
});
