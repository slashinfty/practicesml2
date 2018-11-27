$( "#fileupload" ).change(function() {
    var file = document.getElementById("fileupload").files[0];
    var reader = new FileReader();
    reader.onloadend = function(e) {
        var arrayBuffer = reader.result;
        romCheck(arrayBuffer);
    };
    reader.readAsArrayBuffer(file);
});

$( "#generateRom" ).click(function(){
    var file = document.getElementById("fileupload").files[0];
    var reader = new FileReader();
    reader.onloadend = function(e) {
		doGenerate(reader.result);
    };
    reader.readAsArrayBuffer(file);
});

function romCheck(buffer) {
	var romTest = new Uint8Array(buffer);
	var print = "Not a ROM of MARIOLAND2";
	var origRom = [0x4D, 0x41, 0x52, 0x49, 0x4F, 0x4C, 0x41, 0x4E, 0x44, 0x32];
	var romVerify = 10;
	for (let i = 0; i < origRom.length; i++) {
		if (romTest[0x134 + i] == origRom[i]) {
			romVerify--;
        }
    }
    if (romVerify == 0) {
        if (romTest[0x148] == 0x05 && romTest[0xC2000] < 0x13) {
            print = "DX ROM must be >= v1.8.1"
            document.getElementById("generateRom").disabled = true;
        } else {
            var vOne = romTest[0x14C] == 0x00 ? "v1.0" : "v1.2";
            var dxRom = romTest[0x148] == 0x05 ? "DX - " : "";
            print = "ROM: MARIOLAND2 - " + dxRom + vOne;
            document.getElementById("generateRom").disabled = false;
        }
    } else {
        document.getElementById("generateRom").disabled = true;
    }
    document.getElementById("romVersion").innerHTML = print;
}

function doGenerate(buffer) {
	var rom = new Uint8Array(buffer);
	version1_2 = rom[0x14C] == 0x02;
	isDX = rom[0x148] == 0x05;
	if (document.querySelector("input[name='levelCompletion']:checked").value != "none") {
		clearExits(document.querySelector("input[name='levelCompletion']:checked").value, rom);
	}
	if (document.getElementById("lives").value != "5" || document.getElementById("coins").value != "0") {
		startingLivesCoins(rom);
	}
	if (!document.getElementById("skipLevels").checked) {
		var standardLevels = $( "#enabledSortableStandard" ).sortable( "toArray" );
		var dualLevels = $( "#enabledSortableDual" ).sortable( "toArray" );
		var bossLevels = $( "#enabledSortableBossLevels" ).sortable( "toArray" );
		levels(standardLevels, dualLevels, bossLevels, rom);
	}
	if (!document.getElementById("skipBosses").checked) {
		var bossOrder = $( "#enabledSortableBosses" ).sortable( "toArray" );
		bosses(bossOrder, rom);
	}
	if (!document.getElementById("skipGravity").checked) {
		var checkedLevels = document.querySelectorAll("input[type='radio'].prop:checked");
		gravity(checkedLevels, rom);
	}
	if (!document.getElementById("skipScrolling").checked) {
		var checkedLevels = document.querySelectorAll("input[type='checkbox'].prop:checked");
		scrolling(checkedLevels, rom);
	}
	checksum(rom);
	let d = new Date();
	let date = (d.getUTCMonth() + 1).toString() + d.getUTCDate().toString() + d.getUTCFullYear().toString()
	+ "-" + ("0" + d.getUTCHours().toString()).substr(-2) +("0" + d.getUTCMinutes().toString()).substr(-2);
	let slug = document.getElementById("userFileName").value.length > 0 ? document.getElementById("userFileName").value : date;
	let fileName = "sml2-" + slug + ".gb";
	saveAs(new Blob([buffer], {type: "octet/stream"}), fileName);
}