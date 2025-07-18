'use strict';

const { TTLockClient, sleep } = require('../dist');
const settingsFile = "lockData.json";
require('log-timestamp')(function() { return new Date().toLocaleTimeString()+" | " });

async function doStuff() {
  let lockData = await require("./common/loadData")(settingsFile);
  let options = require("./common/options")(lockData);

  const client = new TTLockClient(options);
  await client.prepareBTService();
  client.startScanLock();
  console.log("Scan started");
  client.on("foundLock", async (lock) => {
    console.log();

    if (lock.isInitialized() && lock.isPaired()) {
      await lock.connect();
      console.log();
      console.log("Trying to UNLOCK the lock ...");
      const unlock = await lock.unlock();

      await lock.disconnect();
      console.log("Disconnected , now Saving Data ?");
      const xxx = await require("./common/saveData")(settingsFile, client.getLockData());
      console.log(" Saved Data ? ", xxx);
      console.log("###");
      process.exit(0);
    }
  });
}

doStuff();