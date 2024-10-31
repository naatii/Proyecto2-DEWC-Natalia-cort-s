import { addCliente, editCliente, borrarCliente, list } from "./API.js";
import { emailInput, empresaInput, nombreInput, telefonoInput } from "./nuevocliente.js";

export const listadoClientes = document.querySelector("#listado-clientes");

export function mostrarNuevoCliente(clientes) {
  if (!listadoClientes) {
    console.error("No se encontró el contenedor de clientes en el DOM");
    return;
  }

  // Limpia el contenido actual si es necesario
  listadoClientes.innerHTML = "";

  // Agrega cada cliente como una nueva fila en la tabla
  clientes.forEach((cliente) => {
    const row = document.createElement("tr");

    // Creación de la fila con botones
    row.innerHTML += `
      <td>${cliente.nombre}</td>
      <td>${cliente.telefono}</td>
      <td>${cliente.empresa}</td>
      <td>
        <button class="bg-green-300 hover:bg-green-400 text-green-800 font-bold py-1 px-1 rounded" onclick="editarCliente('${cliente.email}')">Editar</button>
        <button class="bg-red-300 hover:bg-red-400 text-red-800 font-bold py-1 px-1 rounded" onclick="borrarCliente('${cliente.email}')">Borrar</button>
      </td>
    `;
    listadoClientes.appendChild(row);
  });
}

// Función para redirigir a la página de edición
window.editarCliente = function (email) {
  // Redirige a la página de edición con los parámetros en la URL
  window.location.href = `/editar-cliente.html?email=${encodeURIComponent(
    email
  )}`;
};

window.borrarCliente = function (email) {
  borrarCliente(email);
};

export default function manejarPeticion(cliente) {
  cliente.clientes.forEach((element) => {
    console.log("Añadiendo cliente:", element); // Depuración
    addCliente(
      element.nombre,
      element.email,
      element.telefono,
      element.empresa
    );
  });
}

export function validarNombre(nombre) {
  const regex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
  return regex.test(nombre) && nombre.length > 0; // Verifica que el nombre sea válido
}

export function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular simple para correos
  return regex.test(correo); // Verifica que el correo sea válido
}

export function validarTelefono(telefono) {
  const regex = /^\d{7,}$/; // Solo números y al menos 7 dígitos
  return regex.test(telefono); // Verifica que el teléfono sea válido
}

export function validarEmpresa(empresa) {
  return empresa.length > 0; // Verifica que la empresa no esté vacía
}

export function cargarDatosCliente(cliente) {
    console.log(cliente)
  if (cliente) {
    nombreInput.value = cliente.nombre;
    emailInput.value = cliente.email;
    telefonoInput.value = cliente.telefono;
    empresaInput.value = cliente.empresa;
  }
}
