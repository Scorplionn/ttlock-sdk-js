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
      console.log("Now Collecting some LOCK Infomation  ...     !(muzza)");
      console.log();
      const result = await lock.getModel();
      const result2= await lock.getBattery();
      const result3= await lock.getAddress();
      const result4= await lock.getManufacturer();
      const result5= await lock.getFirmware();
      const result6= await lock.getName();
      const result7= await lock.getRssi();
//      const r8 = await lockType.getProtocolVersion();
  //    console.log("ProtoV:      ", r8, " ");

      console.log("Name:        ", result6, " ");
      console.log("Address:     ", result3, " ");
      console.log("Model Info:  ", result,  " ");
      console.log("Made By:     ", result4, " ");
      console.log("FirmWare:    ", result5, " ")
      console.log("Battery:     ", result2, "%");;
      console.log("RSSI:        ", result7, "dBm");

      await lock.disconnect();
      console.log("###");

      process.exit(0);
    }
  });
}

doStuff();
