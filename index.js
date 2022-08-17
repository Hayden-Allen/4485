console.log("TEST0014");

console.log(`Fetching '${window.location.origin}/api/mongodb-test'...`);

try {
  const req = await window.fetch(`${window.location.origin}/api/mongodb-test`);
  console.log(await req.json());
} catch (err) {
  console.log(err);
}
console.log("Finished");
