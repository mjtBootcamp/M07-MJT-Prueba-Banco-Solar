#### No se borran los usuarios si han hecho transferencias :35 consultas.js


```
const deleteUser = async (id) => {
  const deleteQuery = {
    text: "DELETE FROM usuario WHERE id = $1",
    values: [id],
  };

```

> error: update o delete en «usuario» viola la llave foránea «transferencia_emisor_fkey» en la tabla «transferencia»

#### Valida si hay mas de un usuario con el mismo nombre :68 consultas.js

```
const searchUser = async (values) => {
  console.log("searchUser values", values);
  const getQuery = {
    text: `SELECT id FROM usuario WHERE nombre='${values}';`,
  };
  console.log(getQuery.text);
  try {
    try {
      const result = await pool.query(getQuery);
      if (result.rowCount == 1) {
        return result.rows[0].id;
      }
      console.log(result.rows[0].id);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
```

> No se controla el error si hay mas de un usuario con el mismo nombre

#### Valida si el usuario tiene saldo suficiente :109 consultas.js

```
try {
    const client = await pool.connect();
    try {
      const saldoEmisor = await client.query(consultaSaldoEmisor);
      console.log("saldoEmisor", saldoEmisor.rows[0].balance);

      if (saldoEmisor.rows[0].balance >= monto) {
        try {
          await client.query("BEGIN");
          await client.query(insertHistorial);
          await client.query(updateReceptor);
          await client.query(updateEmisor);
          await client.query("COMMIT");
          client.release();
          return true;
        } catch (error) {
          console.log("Error update");
          await client.query("ROLLBACK");
          throw error;
        }
      } else {
        console.log("No hay saldo suficiente"); ///Entra a error
      }
    } catch (error) {
      console.log("Error update");
      await client.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    throw error;
  }
```

> No se captura el error

## modulos de ico, js y css no funcionan
