'use strict';

const { TTLockClient, sleep } = require('../dist');
const settingsFile = "lockData.json";
require('log-timestamp')(function() { return new Date().toLocaleTimeString()+" | " });

async function doStuff() {
  let lockData = await require("./common/loadData")(settingsFile);
  let options = require("./common/options")(lockData);

  const client = new TTLockClient(options);
  await client.prepareBTService();
  // for (let i = 10; i > 0; i--) {
  //   console.log("Starting scan...", i);
  //   await sleep(1000);
  // }
  client.startScanLock();
  console.log("Scan started");
  client.on("foundLock", async (lock) => {
    console.log();
    
    if (!lock.isInitialized()) {
      await lock.connect();
      console.log();
      console.log("Trying to INIT the lock ...");
      const inited = await lock.initLock();
      
      await lock.disconnect();
      console.log("Disconnected , Save Data ? Check this ...");

      await require("./common/saveData")(settingsFile, client.getLockData());

      console.log("###");
      process.exit(0);
    }
  });
}

doStuff();