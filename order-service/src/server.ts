import dotenv from "dotenv";
import { startApp } from "./app";

// Load environment variables
dotenv.config();

// Start the application
async function run() {
  try {
    const app = await startApp();
    const PORT = process.env.PORT || 3002;

    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
}

run();
