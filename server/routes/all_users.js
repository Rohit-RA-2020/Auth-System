app.get("/", (req, res) => {
  pool.query("SELECT * FROM Users", (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results.rows);
  });
});
