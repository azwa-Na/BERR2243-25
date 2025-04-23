const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017"; // Replace with your actual MongoDB URI
const client = new MongoClient(uri);

const drivers = [
  {
    name: "John Doe",
    vehicleType: "Sedan",
    isAvailable: true,
    rating: 4.8
  },
  {
    name: "Alice Smith",
    vehicleType: "SUV",
    isAvailable: false,
    rating: 4.5
  }
];

// TODO: Show all driver names in the console
console.log("Driver names:");
drivers.forEach(driver => console.log(driver.name));

// TODO: Add additional driver
drivers.push({
  name: "Mark Johnson",
  vehicleType: "Hatchback",
  isAvailable: true,
  rating: 4.6
});

console.log("Updated Drivers Array:", drivers);

async function main() {
  try {
    await client.connect();
    const db = client.db("testDB");
    const driversCollection = db.collection("drivers");

    // Insert drivers
    for (const driver of drivers) {
      const result = await driversCollection.insertOne(driver);
      console.log(`Inserted driver with _id: ${result.insertedId}`);
    }

    // Find available drivers with rating >= 4.5
    const availableDrivers = await driversCollection.find({
      isAvailable: true,
      rating: { $gte: 4.5 }
    }).toArray();
    console.log("Available drivers:", availableDrivers);

    // Update driver rating
    const updateResult = await driversCollection.updateOne(
      { name: "John Doe" },
      { $inc: { rating: 0.1 } }
    );
    console.log(`Driver updated with result:`, updateResult);

    // Delete a driver who is not available
    const deleteResult = await driversCollection.deleteOne({ isAvailable: false });
    console.log(`Driver deleted with result:`, deleteResult);

  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
  }
}

main();
