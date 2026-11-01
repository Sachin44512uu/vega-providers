const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const root = path.join(__dirname, "..");
const providersRoot = path.join(root, "providers");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "manifest.json"), "utf8"),
);

test("manifest values are unique and map to provider directories", () => {
  assert.ok(Array.isArray(manifest) && manifest.length > 0);

  const values = manifest.map((entry) => entry.value);
  assert.equal(new Set(values).size, values.length, "manifest provider values must be unique");

  for (const entry of manifest) {
    assert.equal(typeof entry.display_name, "string");
    assert.ok(entry.display_name.trim(), "provider display_name must not be empty");
    assert.equal(typeof entry.value, "string");
    assert.ok(entry.value.trim(), "provider value must not be empty");
    assert.equal(path.basename(entry.value), entry.value, "provider value must be a folder name");
    const versionParts = String(entry.version).split(".");
    assert.ok(versionParts.length > 0 && versionParts.every((part) => /^[0-9]+$/.test(part)), "provider version must be numeric");
    assert.ok(
      fs.statSync(path.join(providersRoot, entry.value), { throwIfNoEntry: false })?.isDirectory(),
      `manifest entry has no provider directory: ${entry.value}`,
    );
  }
});

test("every provider directory is represented in the manifest", () => {
  const directories = fs
    .readdirSync(providersRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "extractors")
    .map((entry) => entry.name)
    .sort();
  const values = manifest.map((entry) => entry.value).sort();

  assert.deepEqual(directories, values);
});

test("enabled providers contain the four required entry modules", () => {
  const required = ["catalog.ts", "posts.ts", "meta.ts", "stream.ts"];
  for (const entry of manifest.filter((provider) => provider.disabled !== true)) {
    for (const file of required) {
      assert.ok(
        fs.existsSync(path.join(providersRoot, entry.value, file)),
        `enabled provider ${entry.value} is missing ${file}`,
      );
    }
  }
});
