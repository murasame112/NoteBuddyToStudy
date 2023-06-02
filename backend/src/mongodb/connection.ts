const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = "mongodb+srv://murasame_admin:LXhDq7DSvnB3pMFZ@p1-twms.ipvyarg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('sample_guides');
    const planets = database.collection('planets');
    // Query for a movie that has the title 'Back to the Future'
    const query = { name: 'Mercury' };
    const planet = await planets.findOne(query);
    console.log(planet);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);