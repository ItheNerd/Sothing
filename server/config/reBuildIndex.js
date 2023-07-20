const mongoose = require("mongoose");

async function rebuildIndexes() {
  try {
    const collections = mongoose.connection.collections;

    for (const collectionName in collections) {
      const collection = collections[collectionName];
      await collection.dropIndexes();
      await collection.createIndexes();
    }

    console.log("Indexes rebuilt successfully");
  } catch (error) {
    console.error("Error rebuilding indexes:", error);
  }
}

module.exports = rebuildIndexes;
