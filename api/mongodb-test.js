const mongoose = require("mongoose");
require("dotenv").config();

console.log("mongodb-test");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@test.1fkmuj4.mongodb.net/test`
  );

  const Schema = mongoose.Schema;

  const kittenSchema = new Schema({ name: String });
  kittenSchema.methods.speak = function speak() {
    console.log(this.name);
  };
  const Kitten = mongoose.model("Kitten", kittenSchema);

  const test = new Kitten({ name: "Test" });
  await test.save();

  const kittens = await Kitten.find();
  console.log(kittens);
}
