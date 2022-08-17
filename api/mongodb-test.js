const mongoose = require("mongoose");
require("dotenv").config();

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
  try {
    await test.save();
  } catch (err) {
    return err;
  }

  return await Kitten.find();
}

export default async (req, res) => {
  try {
    const kittens = await main();
    res.status(200).json(kittens);
  } catch (err) {
    res.status(500).send(err);
  }
};
