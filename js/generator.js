var version1_2;
var isDX;

//adapted from https://github.com/vhelin/wla-dx/blob/master/wlalink/compute.c#L109-L149
function checksum(rom) {
    var csum = 0;
    var comp = 0;
    for (var i = 0x00; i < 0x14E; i++) {
        csum += rom[i];
    }
    var e = isDX ? 0xFFFFF : 0x7FFFF;
    for (var i = 0x150; i <= e; i++) {
        csum += rom[i];
    }
    rom[0x14E] = (csum >> 8) & 0xFF;
    rom[0x14F] = csum & 0xFF;
    for (var i = 0x134; i <= 0x14C; i++) {
        comp += rom[i];
    }
    comp += 25;
    rom[0x14D] = 0 - (comp & 0xFF);
}

function patch(obj, rom) {
	for (o in obj) {
		for (var i = 0; i < obj[o].array.length; i++) {
			rom[obj[o].dest + i] = obj[o].array[i];
		}
	}
}

const patchAllExitsCleared = {
    o01: {dest: 0x3007E, array: [0x00, 0x78]},
    o02: {dest: 0x33800, array: [0xCD, 0x2E, 0x41, 0x3E, 0x80, 0x06, 0x20, 0x21, 0x08, 0xA0,
    0x22, 0x05, 0x20, 0xFC, 0x06, 0x20, 0x21, 0x58, 0xA0, 0x22, 0x05, 0x20, 0xFC, 0x06, 0x20,
    0x21, 0xA8, 0xA0, 0x22, 0x05, 0x20, 0xFC, 0xC9]}
}

const patchSomeExitsCleared = {
    o01: {dest: 0x3007E, array: [0x00, 0x78]},
    o02: {dest: 0x33800, array: [0xCD, 0x2E, 0x41, 0x3E, 0x80, 0x06, 0x28, 0x21, 0x08, 0xA0,
    0x22, 0x05, 0x20, 0xFC, 0x06, 0x28, 0x21, 0x58, 0xA0, 0x22, 0x05, 0x20, 0xFC, 0x06, 0x28,
    0x21, 0xA8, 0xA0, 0x22, 0x05, 0x20, 0xFC, 0xCD, 0x24, 0x78, 0xC9, 0xAF, 0xEA, 0x0D, 0xA0,
    0xEA, 0x11, 0xA0, 0xEA, 0x16, 0xA0, 0xEA, 0x19, 0xA0, 0xEA, 0x1F, 0xA0, 0xEA, 0x25, 0xA0,
    0xEA, 0x5D, 0xA0, 0xEA, 0x61, 0xA0, 0xEA, 0x66, 0xA0, 0xEA, 0x69, 0xA0, 0xEA, 0x6F, 0xA0,
    0xEA, 0x75, 0xA0, 0xEA, 0xAD, 0xA0, 0xEA, 0xB1, 0xA0, 0xEA, 0xB6, 0xA0, 0xEA, 0xB9, 0xA0,
    0xEA, 0xBF, 0xA0, 0xEA, 0xC5, 0xA0, 0xC9]}
}

const patchLivesCoinsDX = {
	o01: {dest: 0x291B, array: [0x3E, 0x0C, 0xEA, 0x00, 0x21, 0xCD, 0xE0, 0x7F, 0xFA, 0x4E,
	0xA2, 0xEA, 0x00, 0x21, 0xC9]}
}

const patchLiveCoinsNotDX = {
	o01: {dest: 0x291B, array: [0x3E, 0x0C, 0xEA, 0x00, 0x21, 0xCD, 0xE0, 0x7F, 0x3E, 0x0C,
	0xEA, 0x00, 0x21, 0xC9]}
}

const patchLivesCoins1_0 = {
	o01: {dest: 0x3023C, array: [0xCD, 0xE0, 0x7F, 0x18, 0x13]},
	o02: {dest: 0x33FE0, array: [0x3E]},
	o03: {dest: 0x33FE2, array: [0x22, 0x3E]},
	o04: {dest: 0x33FE5, array: [0x22, 0xAF, 0x22, 0x3E]},
	o05: {dest: 0x33FEA, array: [0x22, 0xAF, 0x22, 0x3E, 0x02, 0x22, 0x3E, 0x12, 0x22, 0x3E,
	0x34, 0x22, 0x3E, 0x56, 0x22, 0x3E, 0x78, 0x22, 0xC9]}
}

const patchLivesCoins1_2 = {
	o01: {dest: 0x291E, array: [0x3E, 0x0C, 0xEA, 0x00, 0x21, 0xCD, 0xE0, 0x7F, 0x3E, 0x0C,
	0xEA, 0x00, 0x21, 0xC9]},
	o02: {dest: 0x3023C, array: [0xCD, 0xE0, 0x7F, 0x18, 0x13]},
	o03: {dest: 0x33FE0, array: [0x3E]},
	o04: {dest: 0x33FE2, array: [0x22, 0x3E]},
	o05: {dest: 0x33FE5, array: [0x22, 0xAF, 0x22, 0x3E]},
	o06: {dest: 0x33FEA, array: [0x22, 0xAF, 0x22, 0x3E, 0x02, 0x22, 0x3E, 0x12, 0x22, 0x3E,
	0x34, 0x22, 0x3E, 0x56, 0x22, 0x3E, 0x78, 0x22, 0xC9]}
}

const patchPhysicsScrolling = {
    o01: {dest: 0xDD3, array: [0xCD, 0x49, 0x1A]},
    o02: {dest: 0x1584, array: [0xCD, 0xFF, 0x19, 0x18, 0x02, 0x00, 0x00]},
    o03: {dest: 0x16E9, array: [0xC3, 0x33, 0x1A]},
    o04: {dest: 0x16F2, array: [0xC3, 0x3E, 0x1A]},
    o05: {dest: 0x1850, array: [0x58, 0xCD, 0x09, 0x1A]},
    o06: {dest: 0x19FF, array: [0x16, 0x58, 0xCD, 0x09, 0x1A, 0x78, 0xC6, 0x10,
    0x47, 0xC9, 0xF3, 0x3E, 0x0C, 0xEA, 0x00, 0x20, 0xE5, 0xFA, 0x69, 0xA2, 0xC6,
    0x40, 0x6F, 0x26, 0xA5, 0x7E, 0xE1, 0x82, 0x57, 0x19, 0x7E, 0x47, 0x3E, 0x01,
    0xEA, 0x00, 0x20, 0xFB, 0xC9, 0xE5, 0xFA, 0x69, 0xA2, 0xC6, 0x60, 0x6F, 0x26,
    0xA5, 0x7E, 0x47, 0xE1, 0xC9, 0xCD, 0x26, 0x1A, 0xFA, 0x00, 0xA2, 0x90, 0xEA,
    0x00, 0xA2, 0xC9, 0xCD, 0x26, 0x1A, 0xFA, 0x00, 0xA2, 0x80, 0xEA, 0x00, 0xA2,
    0xC9, 0x26, 0x00, 0xFA, 0x69, 0xA2, 0x6F, 0x01, 0x80, 0xA5, 0x09, 0x7E, 0x47,
    0xC9]},
    o07: {dest: 0x2ABE, array: [0xC3, 0x40, 0x38, 0x00, 0x00]},
    o08: {dest: 0x3840, array: [0x3E, 0x0C, 0xEA, 0x00, 0x21, 0x21, 0x00, 0x70,
    0x11, 0x40, 0xA5, 0x06, 0x60, 0x2A, 0x12, 0x13, 0x05, 0x20, 0xFA, 0x3E, 0x05,
    0xEA, 0x4E, 0xA2, 0xC3, 0xC3, 0x2A]},
    o09: {dest: 0x33000, array: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x04,
    0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04,
    0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04,
    0x04, 0x04, 0x04, 0x04, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]},
    o10: {dest: 0x330AF, array: [0x03, 0x03, 0x02, 0x02, 0x03, 0x02, 0x02, 0x02, 0x01,
    0x02, 0x01, 0x01, 0x02, 0x01, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x00, 0x01, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0xFE, 0xFF, 0xFE, 0xFE, 0xFE,
    0xFD, 0xFE, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFE, 0xFD, 0xFD, 0xFD,
    0xFD, 0xFF, 0xFF, 0xFE, 0xFF, 0xFE, 0xFD, 0xFE, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD,
    0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD,
    0xFD, 0xFD, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
    0x00, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]},
    o11: {dest: 0x331FF, array: [0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE,
    0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF,
    0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE,
    0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF,
    0xFE, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFE,
    0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF,
    0x00, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00,
    0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0xFF,
    0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01,
    0x01, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
    0x01, 0x02, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x02, 0x01, 0x01, 0x01,
    0x02, 0x01, 0x01, 0x01, 0x02, 0x01, 0x01, 0x02, 0x01, 0x01, 0x02, 0x01, 0x02,
    0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01,
    0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02,
    0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0xFF,
    0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0xFF,
    0x00, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF,
    0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00,
    0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
    0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01,
    0x01, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]},
    o12: {dest: 0x334AF, array: [0x03, 0x03, 0x02, 0x02, 0x03, 0x02, 0x02, 0x02, 0x01,
    0x02, 0x01, 0x01, 0x02, 0x01, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x00, 0x01, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0xFE, 0xFF, 0xFE, 0xFE, 0xFE,
    0xFD, 0xFE, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFD, 0xFE, 0xFD, 0xFD, 0xFD,
    0xFD, 0xFF, 0xFF, 0xFE, 0xFF, 0xFE, 0xFD, 0xFE, 0xFD, 0xFD, 0xFD, 0xFC, 0xFC,
    0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFD,
    0xFD, 0xFD, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
    0x00, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]},
    o13: {dest: 0x335FF, array: [0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE,
    0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF,
    0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE,
    0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF,
    0xFE, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFE, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFE,
    0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF,
    0x00, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00,
    0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0xFF,
    0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01,
    0x01, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
    0x01, 0x02, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x02, 0x01, 0x01, 0x01,
    0x02, 0x01, 0x01, 0x01, 0x02, 0x01, 0x01, 0x02, 0x01, 0x01, 0x02, 0x01, 0x02,
    0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01,
    0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02,
    0x01, 0x02, 0x01, 0x02, 0x02, 0x03, 0x01, 0x02, 0x01, 0x02, 0x01, 0x02, 0x01,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0xFF,
    0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0xFF,
    0x00, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF,
    0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00,
    0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
    0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01,
    0x01, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]}
}

function clearExits(amount, rom) {
	if (amount == "some") {
		patch(patchSomeExitsCleared, rom)
	} else if (amount == "all") {
		patch(patchAllExitsCleared, rom)
	}
}

function startingLivesCoins(rom) {
	var startingLives = document.getElementById("lives").value;
	var startingCoins = document.getElementById("coins").value;
	if (version1_2) {
		patch(patchLivesCoins1_2, rom);
	} else  if (isDX) {
		patch(patchLivesCoinsDX, rom);
		patch(patchLivesCoins1_0, rom);
	} else {
		patch(patchLiveCoinsNotDX, rom);
		patch(patchLivesCoins1_0, rom);
	}
	rom[0x33FE4] = startingCoins.length > 2 ? parseInt(startingCoins[0], 16) : 0;
	rom[0x33FE1] = parseInt(startingCoins.slice(-2), 16);
	rom[0x33FE9] = parseInt(startingLives, 16);
}

function levels(standard, dual, boss, rom) {
	const standardOffsets = [0x3C218, 0x3C23B, 0x3C239, 0x3C23C, 0x3C240, 0x3C268, 0x3C269, 0x3C26A,
	0x3C25E, 0x3C24B, 0x3C24C, 0x3C21C, 0x3C27E, 0x3C290, 0x3C25C, 0x3C23E, 0x3C282, 0x3C292];
	const dualOffsets = [0x3C23A, 0x3C241, 0x3C242, 0x3C260, 0x3C21D, 0x3C254, 0x3C24A];
	const bossOffsets = [0x3C238, 0x3C243, 0x3C26B, 0x3C261, 0x3C255, 0x3C24D];
	for (var i = 0; i < standardOffsets.length; i++) {
		rom[standardOffsets[i]] = parseInt(standard[i], 16);
	}
	for (var j = 0; j < dualOffsets.length; j++) {
		rom[dualOffsets[j]] = parseInt(dual[j], 16);
	}
	for (var k = 0; k < bossOffsets.length; k++) {
		rom[bossOffsets[k]] = parseInt(boss[k], 16);
	}
}

function bosses(order, rom) {
	const bossObject = {
		"arrayOne": [
		{levelByte: 0x05, gfxOffset: 0x1413B},
		{levelByte: 0x09, gfxOffset: 0x1413D},
		{levelByte: 0x0D, gfxOffset: 0x14145},
		{levelByte: 0x10, gfxOffset: 0x14141},
		{levelByte: 0x13, gfxOffset: 0x1413F},
		{levelByte: 0x17, gfxOffset: 0x14143}
		],
		"arrayTwo": [
		{levelOffset: 0x8E03, gfxByte: 0x84},
		{levelOffset: 0x8E08, gfxByte: 0x8C},
		{levelOffset: 0x8E0D, gfxByte: 0xAC},
		{levelOffset: 0x8E12, gfxByte: 0x9C},
		{levelOffset: 0x8E17, gfxByte: 0x94},
		{levelOffset: 0x8E1C, gfxByte: 0xA4}
		]
	}
	for (var i = 0; i < bossObject.arrayOne.length; i++) {
		rom[parseInt(order[i], 16)] = bossObject.arrayOne[i].levelByte;
		const gfxObject = bossObject.arrayTwo.find(obj => obj.levelOffset == parseInt(order[i], 16));
		var versionAdj = version1_2 ? 0x7 : 0x0;
		rom[bossObject.arrayOne[i].gfxOffset - versionAdj] = (gfxObject.gfxByte - versionAdj);
	}
}

function scrolling(levels, rom) {
	patch(patchPhysicsScrolling, rom);
	var versionAdj = version1_2 ? 0x3 : 0x0;
	var speedTable = isDX ? 0x93D40 : 0x33040;
	for (var i = 0; i < 20; i++) {
		rom[0x1F71 + i + versionAdj] = 0x0;
		rom[speedTable + i] = 0x1;
	}
	for (var j = 0; j < levels.length; j++) {
		var hex = parseInt(levels[j].dataset.offset, 16);
		if (hex < 0x20) {
			rom[speedTable + hex] = 0x2;
		} else {
			rom[hex + versionAdj] = 0x1;
		}
	}
}

function gravity(levels, rom) {
	var versionAdj = version1_2 ? 0x3 : 0x0;
	for (var i = 0; i < levels.length; i++) {
		rom[parseInt(levels[i].dataset.offset, 16) + versionAdj] = parseInt(levels[i].dataset.byte, 16);
	}
}