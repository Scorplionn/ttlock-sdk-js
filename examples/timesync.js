'use strict';


const { TTLockClient, sleep, PassageModeType } = require('../dist');
const fs = require('fs/promises');
const { TTLockApi } = require('../dist/device/TTLockApi');
const settingsFile = "lockData.json";

require('log-timestamp')(function() { return new Date().toLocaleTimeString()+" | " });

async function doStuff() {
  let lockData = await require("./common/loadData")(settingsFile);
  let options = require("./common/options")(lockData);

  const client = new TTLockClient(options);
  await client.prepareBTService();
  client.startScanLock();
  console.log(new Date().toLocaleTimeString() + ":: Scan started");
  client.on("foundLock", async (lock) => {
    console.log();

    if (lock.isInitialized() && lock.isPaired()) {
      await lock.connect();
      console.log();
       // Get AES key
      // console.log("========= AES key");
      // const aKey = await this.getAESKeyCommand();
      // console.log("========= AES key:", aesKey.toString("hex"));
      
      // const aKey = await this.getAESKeyCommand();
      console.log("Trying to set TIME");
      const result1 = await lock.calibrateTimeCommand();
      // const result = await TTLockApi.getLockTime;
      console.log("Result from Time Calibrate: ", result1, " ??");

     // console.log("====== time");
     // const mykey = await this.calibrateTimeCommand(aesKey);
     // console.log("====== time");
      await lock.disconnect();
      console.log("###");
      process.exit(0);
    }
  });
}

doStuff();
