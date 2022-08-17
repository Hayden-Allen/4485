const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
  console.log(process.env);
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

export default async (req, res) => {
  console.log("mongodb-test");
  console.log(req);
  main().catch((err) => console.log(err));
  res.status(200).send("OK");
};
