import {
  validarNombre,
  validarTelefono,
  validarEmpresa,
  validarCorreo,
} from "./funciones.js";
import { addCliente, editCliente } from "./API.js";

export const nombreInput = document.querySelector("#nombre");
export const emailInput = document.querySelector("#email");
export const telefonoInput = document.querySelector("#telefono");
export const empresaInput = document.querySelector("#empresa");

export function validarFormulario() {
  document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#formulario");
    const botonEnviar = formulario.querySelector("input[type=submit]");
    botonEnviar.disabled = true; // Deshabilitar botón inicialmente
    botonEnviar.style.opacity = "0.5"; // Opacidad del botón deshabilitado

    // Añadir eventos de validación a cada campo
    nombreInput.addEventListener("blur", () => {
      if (!validarNombre(nombreInput.value.trim())) {
        showError(
          nombreInput,
          "Nombre: debe contener solo letras y no estar vacío."
        );
      } else {
        resetInputStyles(nombreInput);
      }
    });

    emailInput.addEventListener("blur", () => {
      if (!validarCorreo(emailInput.value.trim())) {
        showError(emailInput, "Correo: debe ser un correo electrónico válido.");
      } else {
        resetInputStyles(emailInput);
      }
    });

    telefonoInput.addEventListener("blur", () => {
      if (!validarTelefono(telefonoInput.value.trim())) {
        showError(
          telefonoInput,
          "Teléfono: debe contener solo números y tener al menos 7 dígitos."
        );
      } else {
        resetInputStyles(telefonoInput);
      }
    });

    empresaInput.addEventListener("blur", () => {
      if (!validarEmpresa(empresaInput.value.trim())) {
        showError(empresaInput, "Empresa: no puede estar vacía.");
      } else {
        resetInputStyles(empresaInput);
      }
    });

    // Función para validar todos los campos
    const checkFormularioValido = () => {
      const nombre = nombreInput.value.trim();
      const correo = emailInput.value.trim();
      const telefono = telefonoInput.value.trim();
      const empresa = empresaInput.value.trim();

      return (
        validarNombre(nombre) &&
        validarCorreo(correo) &&
        validarTelefono(telefono) &&
        validarEmpresa(empresa)
      );
    };

    // Comprobamos el estado del formulario en cada input
    formulario.addEventListener("input", () => {
      const isValid = checkFormularioValido();
      botonEnviar.disabled = !isValid;
      botonEnviar.style.opacity = isValid ? "1" : "0.5";
    });

    formulario.addEventListener("submit", (e) => {
      e.preventDefault(); // Previene el envío del formulario

      // Verificar si el formulario es válido antes de enviar
      if (checkFormularioValido()) {
        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const empresa = empresaInput.value.trim();

        // Usar el parámetro isEditing para decidir si agregar o editar
        if (window.location.pathname.includes("editar-cliente.html")) {
            editCliente(nombre, email, telefono, empresa);
        } else {
            addCliente(nombre, email, telefono, empresa);
        }
      } else {
        console.log("Hay errores en el formulario.");
      }
    });
  });
}

// Función para mostrar errores
function showError(inputElement, message) {
  let errorElement = inputElement.nextElementSibling;
  if (!errorElement || !errorElement.classList.contains("error-message")) {
    errorElement = document.createElement("span");
    errorElement.classList.add("error-message", "text-red-500");
    inputElement.parentNode.insertBefore(
      errorElement,
      inputElement.nextSibling
    );
  }
  errorElement.textContent = message;
  inputElement.classList.add("border-red-500");
}

// Función para resetear estilos de input
function resetInputStyles(inputElement) {
  const errorElement = inputElement.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.remove();
  }
  inputElement.classList.remove("border-red-500");
}

// Llamada con true o false según si quieres añadir o editar
validarFormulario()