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
      console.log("Trying to SET a passage mode");
      const result = await lock.setPassageMode({
        type: PassageModeType.WEEKLY,
        weekOrDay: 0,
        month: 0,
        startHour: "0900",
        endHour: "1800"
      });
      console.log("Result: ", result);
      await lock.disconnect();
      console.log("###");
      process.exit(0);
    }
  });
}

doStuff();