# Uso de Indexeddb 

## ¿Qué es IndexedDb?

Indexed db, es una base de datos construida dentro del navegador es mucho más potente que el localstorage, además según la información obtenida en javascript.info

- Almacena casi todo tipo de valores por claves, tipos de clave múltiple.
- Soporta transacciones para confiabilidad.
- Soporta consultas de rango por clave, e índices.
- Puede almacenar mucho mayor volumen de datos que localStorage.

Esta tecnología normalmente es excesiva para aplicaciones cliente-servidor tradicionales, de hecho está previsto para aplicaciones fuera de línea y para ser combinado con otras tecnologías como serviceworkers.

Tal y como vemos en es esta web informativa vemos como la interfaz nativa de indexedDb, descrita en https://www.w3.org/TR/IndexedDB donde vemos como está basada en eventos. Aunque también podemos usar asincronías `async/await` con ayuda de [`idb`](https://github.com/jakearchibald/idb), aunque no es perfecto a pesar de ser una muy buena herramienta.

Antes de la Explicación dejo aquí una pequeña cheatsheet cheatsheet de [indexedDB](./cheatsheet.md)

## Explicación en mi código

En primer lugar tal y como se indica en la web de [javascript.info](https://es.javascript.info/indexeddb) inicié la apertura de la base de datos

```js
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
```
Indicandole que como clave primaria quería usar el email, ya que es algo que normalmente no se va a repetir, se podría haber usado paralelamente un indice artificial, aparte del email por ejemplo, pero como es un ejemplo sencillo he preferido la utilización del email para la clave primaria. He estado usando la versión 1 ya que no me interesaba el manejo tan específico de cuando se inicia por primera vez o no como en javascript.ifo se indica: 

> Código de ejemplo proporcionado por javascript.info para la utilización del modo 2:
```js
let openRequest = indexedDB.open("store", 2);

openRequest.onupgradeneeded = function(event) {
  // la versión de la base existente es menor que 2 (o ni siquiera existe)
  let db = openRequest.result;
  switch(event.oldVersion) { // versión de db existente
    case 0:
      // version 0 significa que el cliente no tiene base de datos
      // ejecutar inicialización
    case 1:
      // el cliente tiene la versión 1
      // actualizar
  }
};
```

Luego he hecho una función para listar los elementos de la base de datos.

```js
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
```
Llamando a la funcion `mostrarNuevoCliente(clientes)` que es la encargada de renderizar el contendio en el html. 

A continuación se ha creado una transacción, básicamente se usa la palabra transacción para las operaciones crud de la base de datos, yo he creado el crud completo.

- Añadir
```js
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
```
- Editar
```js
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
```
- Borrar
```js
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
```
- Obtener
```js
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
```
En resumen la estructura que he usado para cada función es la misma, se realiza una transacción a la base de datos con su respectivo modo de uso, `readonly` si es solo lectura `readwrite` si es escritura y lectura, etc luego se espera a que la petición se realice correctamente `request.onsuccess` y si no se espera al error `request.onerror`, ya que toda la base de datos funciona de forma asíncrona todas las request funcionan de forma asíncrona también. Y por último se retorna el request para poder manejar el estado de la respuesta en el javascript.
