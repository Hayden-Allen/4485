console.log("TEST0014");

console.log(`Fetching '${window.location.origin}/api/mongodb-test'...`);
console.log(await window.fetch(`${window.location.origin}/api/mongodb-test`));
