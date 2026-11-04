// Run with: node tests/storage.test.cjs
// Native phone storage and files are replaced with small in-memory stand-ins.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const compiled = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, '../lib/storage.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } },
).outputText;

function makePhone() {
  const records = new Map();
  const files = new Set(['file:///cache/picked.jpg']);
  let failWrites = false;
  const storage = {
    getItem: async (key) => records.get(key) ?? null,
    setItem: async (key, value) => {
      if (failWrites) throw new Error('Phone storage full');
      records.set(key, value);
    },
    multiRemove: async (keys) => keys.forEach((key) => records.delete(key)),
  };
  class Directory {
    constructor(base, name) { this.uri = `${base}/${name}`; }
    create() { files.add(this.uri); }
    get exists() { return files.has(this.uri); }
    delete() { for (const uri of files) if (uri.startsWith(this.uri)) files.delete(uri); }
  }
  class File {
    constructor(base, name) { this.uri = name ? `${base.uri}/${name}` : base; }
    get extension() { return path.extname(this.uri); }
    get exists() { return files.has(this.uri); }
    async copy(destination) {
      assert.ok(this.exists, 'The selected photo must exist');
      files.add(destination.uri);
    }
    delete() { files.delete(this.uri); }
  }
  function openApp() {
    const module = { exports: {} };
    vm.runInNewContext(compiled, {
      exports: module.exports,
      require(name) {
        if (name === '@react-native-async-storage/async-storage') return storage;
        if (name === 'expo-file-system') return { Directory, File, Paths: { document: 'file:///documents' } };
        throw new Error(`Unexpected import: ${name}`);
      },
    });
    return module.exports;
  }
  return { records, files, openApp, failWrites: () => { failWrites = true; } };
}

const location = { latitude: 5.6037, longitude: -0.187, address: 'Accra', landmark: 'Blue gate' };
const waste = { size: 'Large bag', quantity: 2, type: 'General', photoUri: null };

test('setup survives reopening only after both steps are saved', async () => {
  const phone = makePhone();
  const app = phone.openApp();
  assert.equal(await app.isSetupDone(), false);
  await app.saveLocation(location);
  assert.equal(await app.isSetupDone(), false);
  await app.saveUsualWaste(waste);
  const reopened = phone.openApp();
  assert.equal(await reopened.isSetupDone(), true);
  assert.equal((await reopened.getLocation()).landmark, 'Blue gate');
  assert.equal((await reopened.getUsualWaste()).quantity, 2);
});

test('waste cannot complete setup without location or with invalid choices', async () => {
  const app = makePhone().openApp();
  await assert.rejects(app.saveUsualWaste(waste));
  await assert.rejects(app.saveLocation({ ...location, latitude: 100 }));
  await app.saveLocation(location);
  for (const quantity of [0, 11, 1.5]) await assert.rejects(app.saveUsualWaste({ ...waste, quantity }));
  await assert.rejects(app.saveUsualWaste({ ...waste, type: '' }));
  assert.equal(await app.isSetupDone(), false);
});

test('a failed save does not mark setup complete', async () => {
  const phone = makePhone();
  const app = phone.openApp();
  await app.saveLocation(location);
  phone.failWrites();
  await assert.rejects(app.saveUsualWaste({ ...waste, photoUri: 'file:///cache/picked.jpg' }));
  assert.equal(await app.isSetupDone(), false);
  assert.equal([...phone.files].filter((uri) => uri.includes('/waste-')).length, 0);
});

test('photos leave the cache and reset clears only BorlaGo setup and its photos', async () => {
  const phone = makePhone();
  const app = phone.openApp();
  phone.records.set('other-app-data', 'keep me');
  await app.saveLocation(location);
  await app.saveUsualWaste({ ...waste, photoUri: 'file:///cache/picked.jpg' });
  const saved = await app.getUsualWaste();
  assert.ok(saved.photoUri.startsWith('file:///documents/borlago-photos/'));
  phone.files.delete('file:///cache/picked.jpg');
  assert.ok(phone.files.has(saved.photoUri), 'The saved photo survives cache removal');
  await app.resetSetup();
  assert.equal(await app.isSetupDone(), false);
  assert.equal(await app.getLocation(), null);
  assert.equal(await app.getUsualWaste(), null);
  assert.equal(phone.records.get('other-app-data'), 'keep me');
  assert.equal(phone.files.has(saved.photoUri), false);
});

test('incomplete or damaged records never skip setup', async () => {
  const phone = makePhone();
  phone.records.set('borlago:location', '{broken json');
  phone.records.set('borlago:usual-waste', JSON.stringify(waste));
  assert.equal(await phone.openApp().isSetupDone(), false);
  phone.records.set('borlago:location', JSON.stringify(location));
  phone.records.set('borlago:usual-waste', JSON.stringify({ ...waste, quantity: 99 }));
  assert.equal(await phone.openApp().isSetupDone(), false);
});
