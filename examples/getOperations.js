'use strict';

const { TTLockClient, LogOperateNames } = require('../dist');
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

    if (lock.isInitialized() && lock.isPaired()) {
      await lock.connect();
      console.log();
      console.log("Trying to GET Operations Log");

      // make a copy so we don't save the record names
      const results = JSON.parse(JSON.stringify(await lock.getOperationLog(true, true)));

      await lock.disconnect();
      for (let result of results) {
        if (result) {
          result.recordTypeName = LogOperateNames[result.recordType];
        }
      }
      console.log(results);

      await require("./common/saveData")(settingsFile, client.getLockData());
      console.log("###");
      process.exit(0);
    }
  });
}

doStuff();
