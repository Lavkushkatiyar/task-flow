require("dotenv").config();

const app = require("./app");
const AppDataSource = require("./db/data_source");
const { seedAdmin } = require("./utils");

const PORT = process.env.PORT || 8000;

AppDataSource.initialize()
  .then(async () => {
    await seedAdmin();
    console.log("database ready");
    
    app.listen(PORT, () => {
      console.log("serverStarted :", PORT);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
