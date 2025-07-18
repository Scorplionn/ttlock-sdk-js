'use strict';

import { EventEmitter } from "events";
import { LockType } from "../constant/Lock";

export class TTDevice extends EventEmitter {
  id: string = "";
  uuid: string = "";
  name: string = "";
  manufacturer: string = "unknown";
  model: string = "unknown";
  hardware: string = "unknown";
  firmware: string = "unknown";
  address: string = "";
  rssi: number = 0;
  protocolType: number = 0;
  protocolVersion: number = 0;
  scene: number = 0;
  groupId: number = 0;
  orgId: number = 0;
  lockType: LockType = LockType.UNKNOWN;
  isTouch: boolean = false;
  isUnlock: boolean = false;
  hasEvents: boolean = true;
  isSettingMode: boolean = false;
  txPowerLevel: number = 0;
  batteryCapacity: number = -1;
  date: number = 0;
  isWristband: boolean = false;
  isRoomLock: boolean = false;
  isSafeLock: boolean = false;
  isBicycleLock: boolean = false;
  isLockcar: boolean = false;
  isGlassLock: boolean = false;
  isPadLock: boolean = false;
  isCyLinder: boolean = false;
  isRemoteControlDevice: boolean = false;
  isDfuMode: boolean = false;
  isNoLockService: boolean = false;
  remoteUnlockSwitch: number = 0;
  disconnectStatus: number = 0;
  parkStatus: number = 0;

  toJSON(asObject: boolean = false): string | Object {
    const json: { [key: string]: any } = {};

    const excludedKeys = new Set([
      "_eventsCount"
    ]);

    Object.getOwnPropertyNames(this).forEach((key) => {
      if (!excludedKeys.has(key)) {
        const val = Reflect.get(this, key);

        if (val !== undefined && val !== '') {
          if (typeof val === "object" && val !== null) {
            if (Buffer.isBuffer(val)) {
              if (val.length > 0) {
                json[key] = val.toString('hex');
              }
            }
            else if(Array.isArray(val)) {
              if (val.length > 0) {
                json[key] = val.toString();
              }
            }
            else {
              json[key] = val;
            }
          } else {
            json[key] = val;
          }
        }
      }
    });

    return asObject ? json : JSON.stringify(json);
  }
}