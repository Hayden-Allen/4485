console.log("TEST0014");

console.log(`Fetching '${window.location.origin}/api/mongodb-test'...`);

const req = await window.fetch(`${window.location.origin}/api/mongodb-test`);
console.log(await req.json());
if (req.ok) {
  console.log("Finished");
} else {
  console.log("ERROR");
}
