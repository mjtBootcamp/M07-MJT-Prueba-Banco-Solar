const { pool } = require("./generaPool");

const insertUser = async (values) => {
  const insertQuery = {
    text: "INSERT INTO usuario (nombre,balance,vigencia) VALUES ($1,$2,true)",
    values,
  };
  try {
    try {
      await pool.query(insertQuery);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

const getUsers = async () => {
  const getQuery = {
    text: "SELECT id,nombre,balance FROM usuario WHERE vigencia = true",
  };
  try {
    try {
      const result = await pool.query(getQuery);
      return result.rows;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  const deleteQuery = {
    text: `UPDATE usuario SET vigencia = false WHERE id = ${id};`,
  };

  try {
    await pool.query(deleteQuery);
  } catch (error) {
    throw error;
  }
};

const updateUser = async (values, id) => {
  const updateQuery = {
    text: `UPDATE usuario SET nombre = $1, balance = $2 WHERE id = ${id};`,
    values,
  };
  try {
    try {
      await pool.query(updateQuery);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
const searchUser = async (values) => {
  const getQuery = {
    text: `SELECT id FROM usuario WHERE nombre='${values}';`,
  };
  try {
    try {
      const result = await pool.query(getQuery);
      if (result.rowCount == 1) {
        return result.rows[0].id;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
const insertTransaction = async (values) => {
  const idReceptor = await searchUser(values[1]);
  const idEmisor = await searchUser(values[0]);
  const monto = values[2];
  const insertHistorial = {
    text: `INSERT INTO transferencia(emisor,receptor, monto,fecha) VALUES (${idEmisor},${idReceptor},${monto},(to_timestamp(${Date.now()} / 1000.0)));`,
  };
  const updateReceptor = {
    text: `UPDATE usuario SET balance = balance + ${monto} WHERE id = ${idReceptor};`,
  };
  const updateEmisor = {
    text: `UPDATE usuario SET balance = balance - ${monto} WHERE id = ${idEmisor};`,
  };

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(insertHistorial);
      await client.query(updateReceptor);
      await client.query(updateEmisor);
      await client.query("COMMIT");
      client.release();
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      return false;
    }
  } catch (error) {
    throw error;
  }
};

const getHistorial = async () => {
  const selectTransferencias = {
    text: "SELECT t.id,(SELECT u.nombre FROM usuario u INNER JOIN transferencia t on t.emisor=u.id LIMIT 1) as nombreemisor,  u.nombre AS nombrereceptor, t.monto, t.fecha FROM usuario u INNER JOIN transferencia t on u.id = t.receptor;",
    rowMode: "array",
  };
  try {
    try {
      const result = await pool.query(selectTransferencias);
      return result.rows;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertUser,
  getUsers,
  deleteUser,
  updateUser,
  insertTransaction,
  getHistorial,
};
