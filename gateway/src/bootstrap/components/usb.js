const drivelist = require('drivelist');


module.exports = function (config) {
  return new Promise((resolve, reject) => {
     
    drivelist.list((error, drives) => {
        if (error) {
            throw error;
        }
    
        console.log(drives);
        // {
        // enumerator: 'lsblk:json',
        // busType: 'USB',
        // busVersion: null,
        // device: '/dev/sdb',
        // devicePath: null,
        // raw: '/dev/sdb',
        // description: 'General USB Flash Disk',
        // error: null,
        // size: 4023386112,
        // blockSize: 512,
        // logicalBlockSize: 512,
        // mountpoints: [],
        // isReadOnly: false,
        // isSystem: false,
        // isVirtual: false,
        // isRemovable: true,
        // isCard: null,
        // isSCSI: false,
        // isUSB: true,
        // isUAS: null
        // }

        resolve()
    });
  })
}
