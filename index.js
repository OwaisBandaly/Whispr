import app from "./src/app.js";
import ConnectDB from "./src/db/index.js";

ConnectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.error("Failed to start the server:", error);
});