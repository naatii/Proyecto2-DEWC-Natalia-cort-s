import { editCliente, init, obtenerCliente } from "./API.js";
import { cargarDatosCliente } from "./funciones.js";
import { validarFormulario } from "./nuevocliente.js";

init().onsuccess = () => {
    
  const parametrosURL = new URLSearchParams(window.location.search);
  const email = parametrosURL.get("email");
  console.log(email);
  const restultadoCliente = obtenerCliente(email)
  restultadoCliente.onsuccess = () => {
    console.log(restultadoCliente)
    cargarDatosCliente(restultadoCliente.result);
  };
  validarFormulario();
};
