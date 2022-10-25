import mongoose from "mongoose";
const MONGODB_URI = "mongodb+srv://admin:admin@test.1fkmuj4.mongodb.net/test";
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function connectToDb() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose2) => {
      return mongoose2;
    });
  }
  cached.conn = await cached.promise;
  console.log(cached);
  return cached.conn;
}
const KittenSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  }
});
KittenSchema.methods.speak = function() {
  console.log(this.name);
};
const Kitten = mongoose.models.Kitten || mongoose.model("Kitten", KittenSchema);
async function createKitten(options) {
  await connectToDb();
  const kitten = new Kitten({
    name: options.name
  });
  await kitten.save();
  return kitten;
}
async function POST({ request }) {
  await connectToDb();
  const body = await request.json();
  const kitten = await createKitten(body);
  console.log(kitten);
  return new Response(
    JSON.stringify({
      name: kitten.name
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
export {
  POST
};
