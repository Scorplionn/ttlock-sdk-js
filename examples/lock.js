'use strict';

const { TTLockClient, sleep } = require('../dist');
const fs = require('fs/promises');
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
      console.log("Trying to LOCK the lock ....");
      const result = await lock.lock();
      console.log("Lock request result: ",result);

      await lock.disconnect();
      const newLockData = client.getLockData();
      //console.log(JSON.stringify(newLockData));
      try {
        await fs.writeFile(settingsFile, Buffer.from(JSON.stringify(newLockData)));
      } catch (error) {
        process.exit(1);
      }
      console.log("###");
      process.exit(0);
    }
  });
}

doStuff();