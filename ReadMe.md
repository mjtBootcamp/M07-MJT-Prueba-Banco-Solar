# Prueba

#### Descripción

> El Banco Solar acaba de decidir invertir una importante suma de dinero para contratar un equipo de desarrolladores Full Stack que desarrollen un nuevo sistema de transferencias, y han anunciado que todo aquel que postule al cargo debe realizar un servidor con Node que utilice PostgreSQL para la gestión y persistencia de datos, y simular un sistema de transferencias.

### El sistema debe permitir

1. registrar nuevos usuarios
2. con un balance inicial y basados en éstos,
3. realizar transferencias de saldos entre ellos.

En esta prueba contarás con una aplicación cliente preparada para consumir las rutas que deberás crear en el servidor. A continuación se muestra una imagen con la interfaz mencionada.

### Las rutas que deberás crear son las siguientes:

- / GET: Devuelve la aplicación cliente disponible en el apoyo de la prueba.
- /usuario POST: Recibe los datos de un nuevo usuario y los almacena en PostgreSQL.
- /usuarios GET: Devuelve todos los usuarios registrados con sus balances.
- /usuario PUT: Recibe los datos modificados de un usuario registrado y los actualiza.
- /usuario DELETE: Recibe el id de un usuario registrado y lo elimina .
- /transferencia POST: Recibe los datos para realizar una nueva transferencia. Se debe ocupar una transacción SQL en la consulta a la base de datos.
- /transferencias GET: Devuelve todas las transferencias almacenadas en la base de datos en formato de arreglo.

---

Para iniciar con la persistencia de datos se deben ocupar las siguientes instrucciones SQL:

```
CREATE DATABASE bancosolar;
CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(50),
balance FLOAT CHECK (balance >= 0));
CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor INT, receptor
INT, monto FLOAT, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES
usuarios(id), FOREIGN KEY (receptor) REFERENCES usuarios(id));
```

## Requerimientos

### 1. Utilizar el paquete pg para conectarse a PostgreSQL y realizar consultas DML para la gestión y persistencia de datos. (3 Puntos)

### 2. Usar transacciones SQL para realizar el registro de las transferencias. (2 Puntos)

### 3. Servir una API RESTful en el servidor con los datos de los usuarios almacenados en PostgreSQL. (3 Puntos)

### 4. Capturar los posibles errores que puedan ocurrir a través de bloques catch o parámetros de funciones callbacks para condicionar las funciones del servidor. (1 Punto)

### 5. Devolver correctamente los códigos de estado según las diferentes situaciones. (1 Punto)

##

# INSTRUCCIONES
> Instalar nodeJs
> Ejecutar en la carpeta MJT-v1-Prueba-Banco-Solar el comando
```
npm install
```
> Ejecutar 
```
npm run start
```
> Abrir el explorador en [http://localhost:3000/](http://localhost:3000/)

# OBSERVACIONES

> Al entregarse en body sólo el nombre del usuario en los inputs. Este valor del campo nombre se podría repetir entre usuarios y al realizar una busqueda del valor para encontrar el id del usuario el resultado siempre será el primer usuario registrado con ese nombre.

```
  $("form:last").submit(async (e) => {
    e.preventDefault();
    let emisor = $("form:last select:first").val();
    let receptor = $("form:last select:last").val();
    let monto = $("#monto").val();
    if (!monto || !emisor || !receptor) {
      alert("Debe seleccionar un emisor, receptor y monto a transferir");
      return false;
    }
    try {
      const response = await fetch("http://localhost:3000/transferencia", {
        method: "post",
        body: JSON.stringify({
          emisor,
          receptor,
          monto,
        }),
      });
      const data = await response.json();
      location.reload();
    } catch (e) {
      alert("Algo salió mal..." + e);
    }
  });
```

> La necesidad de borrar usuarios y que persistan sus transferencias, por sugerencia de Fdo se resuelve con un nuevo campo en la tabla usuarios que registra su vigencia según el cual será o no enviado al front en GET

```
ALTER TABLE usuario ADD COLUMN vigencia BOOLEAN;
```

```
const insertQuery = {
    text: "INSERT INTO usuario (nombre,balance,vigencia) VALUES ($1,$2,true)",
    values,
  };

const deleteQuery = {
    text: `UPDATE usuario SET vigencia = false WHERE id = ${id};`,
  };

 const getQuery = {
    text: "SELECT id,nombre,balance FROM usuario WHERE vigencia = true",
  };

```

> Es necesario agregar lineas para resetear las etiquetas options en los imputs receptor y emisor tambien cuando se eliminen Usuarios

```
const getUsuarios = async () => {
    const response = await fetch("http://localhost:3000/usuarios");
    let data = await response.json();
    $(".usuarios").html("");
    $("#emisor").html("");
    $("#receptor").html("");
    $.each(data, (i, c) => {
      $(".usuarios").append(`
              <tr>
                <td>${c.nombre}</td>
                <td>${c.balance}</td>
                <td>
                  <button
                    class="btn btn-warning mr-2"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onclick="setInfoModal('${c.nombre}', '${c.balance}', '${c.id}')"
                  >
                    Editar</button
                  ><button class="btn btn-danger" onclick="eliminarUsuario('${c.id}')">Eliminar</button>
                </td>
              </tr>
         `);

      $("#emisor").append(`<option value="${c.nombre}">${c.nombre}</option>`);
      $("#receptor").append(`<option value="${c.nombre}">${c.nombre}</option>`);
    });
  };
```
