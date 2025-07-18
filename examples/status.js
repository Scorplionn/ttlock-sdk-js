'use strict';

const { TTLockClient, sleep, PassageModeType } = require('../dist');
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
      console.log("Trying to get lock/unlock STATUS");
      const result = await lock.getLockStatus();
      if (result != -1) {
        if (result == 0) {
          console.log("Lock is LOCKED     Code:", result, " 0=L  1=UL");
        } else {
          console.log("Lock is UNLOCKED   Code:", result, " 0=L  1=UL");
        }
      } else {
        console.log("Failed to get lock status");
      }
      await lock.disconnect();
      console.log("###");

      process.exit(0);
    }
  });
}

doStuff();
