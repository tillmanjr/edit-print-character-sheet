const releaseNotes = new Object(
    {
    v1_0_0: ``,
    v1_0_1: ``,
    v1_1_0: `v1.1.0
Changes:
  Add release notes (releaseNotes) to script.
  Swapped order of Import Export buttons
  Changed Export button label to Save
  Add Imported From filename and Imported At tracking.
    Stored in exported JSON.
  Add Saved As filename and Saved At tracking
  Added info tooltip displaying:
    Imported from filename and when
    Saved as filename and when
  Added Character level and current date to generated Save Filename 
    format: CharacterName-Campaign-Setting-CharacterLevel-CurrentDate
    `
    }
)
// class used by all elements that have data
const dataElementClass = "has-data";
// All elements having data. 
// Keyed by element id with value as property used to store the data
const dataLocations = {
    data_character_name: "value",
    data_player_name: "value",
    data_date: "value",
    data_race: "value",
    data_class: "value",
    data_level: "value",
    data_xp: "value",
    data_weapons: "multiline",
    data_equipment: "multiline",
    data_page1_notes1: "multiline",
    data_page1_notes2: "multiline",
    data_str: "value",
    data_str_mod: "textContent",
    data_int: "value",
    data_int_mod: "textContent",
    data_wis: "value",
    data_wis_mod: "textContent",
    data_dex: "value",
    data_dex_mod: "textContent",
    data_con: "value",
    data_con_mod: "textContent",
    data_cha: "value",
    data_cha_mod: "textContent",
    data_death: "value",
    data_death_mod: "textContent",
    data_wands: "value",
    data_wands_mod: "textContent",
    data_petrify: "value",
    data_petrify_mod: "textContent",
    data_breath: "value",
    data_breath_mod: "textContent",
    data_spells: "value",
    data_spells_mod: "textContent",
    data_campaign: "value",
    data_setting: "value",
    data_ac: "value",
    data_move: "value",
    data_hp: "value",
    data_attack_bonus: "value",
    data_money: "value",
    data_backstory: "multiline",
    data_notes: "multiline",
    data_morenotes: "multiline",
    data_evenmorenotes: "multiline"
}

function readDataElement(id, storedIn) {
    const element = document.getElementById(id);
    if (storedIn === "multiline") {
        return element.value;
    }
    return element[storedIn];
}

function collectData() {
    const entries = Object.entries(dataLocations)
    console.table(entries)
    const data = entries.map(location => {
        const id = location[0];
        const storedIn = location[1];
        return {
            id,
            value: readDataElement(id, storedIn)
        }
    });
    const meta = [
        {data_file_version: document.getElementById("fixed_source_version").value},
        {data_file_creation: new Date().toISOString()}
    ]
    return meta.concat(data);
}

function updateDataElement(id, value) {
    const element = document.getElementById(id);
    const location = dataLocations[id];
    if (location) {
        const storedIn = location;
        console.dir('Importing datum ', id, value, storedIn)
        if (storedIn === "value") {
            element[storedIn] = value;
            return
        }
        if (storedIn === "textContent") {
            element[storedIn] = value;
            return
        }
        if (storedIn === "multiline") {
            element.value = value;
            return
        }
    }
}

function exportJSONToFile(jsonObject, filename) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonObject));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importData(data) {
    console.log('Importing data')
    const fileInput = document.getElementById("importFileElement")
    if (fileInput) {
        fileInput.click();
    }
}


/**
 * From a UTC Date object return a new Date explicitly converted to locale date and time
 * @param {Date} UTC Date object
 * @return {Date} 
 */
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}


/**
 * Converts a number to a string with 0 prefixed to a minimum length of 2
 * @param {number} num
 */
const numberToMinTwoCharacterString = (num) => num.toString().padStart(2, '0')

/**
 * Current local date as 8 character formatted string - YYYYMMDD
 * @return {string} 
 */
function nowToMinimalDateString() {
    const localDate = convertUTCDateToLocalDate(new Date())
    return `${localDate.getFullYear()}${numberToMinTwoCharacterString(localDate.getMonth()+1)}${numberToMinTwoCharacterString(localDate.getDate())}` 
}

function exportData() {
    console.log('Collecting data')
    const data = collectData();
    if (!data) {
        console.error('No data collected');
        return;
    }
    if (data) {
        const charName = data.find(d => d.id === "data_character_name").value;
        const saveCharName = charName ? charName : 'unkownCharacter'

        const campaign = data.find(d => d.id === "data_campaign").value;
        const saveCampaign = campaign ? campaign : 'unknownCampaign'

        const setting = data.find(d => d.id === "data_setting").value;
        const saveSetting = setting ? setting : 'unknownSetting'

        const level = data.find(d => d.id === "data_level").value;
        const saveLevel = level ? level.padStart(2, '0') : '0'

        const saveDate = nowToMinimalDateString()

        const saveFileName = `${saveCharName}-${saveCampaign}-${saveSetting}-${saveLevel}-${saveDate}.json`
        
        console.log('Exporting data to ', saveFileName)
        exportJSONToFile(data, saveFileName);

        const lastSavedAsFilename = document.getElementById('last_saved_as_filename')
        if (lastSavedAsFilename) {
            lastSavedAsFilename.value = saveFileName
        }

        const lastSavedAt = document.getElementById('last_saved_at')
        if (lastSavedAt) {
            const lastSavedAtStr = new Date().toLocaleDateString()
            lastSavedAt.value = lastSavedAtStr
        }
    }
}

function updateFileTooltip() {
    const lastSavedAsFilenameElement = document.getElementById('last_saved_as_filename')
    const lastSavedAsFilenameValue = lastSavedAsFilenameElement ? lastSavedAsFilenameElement.value : 'not saved'
    const lastSavedAsTooltip = document.getElementById('tooltip_saved_as')
    if (lastSavedAsTooltip) {
        lastSavedAsTooltip.textContent = lastSavedAsFilenameValue
    }

     // tooltip_saved_at
    const lastSavedAt = document.getElementById('last_saved_at')
    const lastSavedAtValue = lastSavedAt ? lastSavedAt.value : 'na'
    const lastSavedAtTooltip = document.getElementById('tooltip_saved_at')
    if (lastSavedAtTooltip) {
        lastSavedAtTooltip.textContent = lastSavedAtValue ? `at ${lastSavedAtValue}` : ''
    }

     // tooltip_imported_from
    const importedFromFileElement = document.getElementById('imported_from_filename')
    const importedFromFileValue = importedFromFileElement ? importedFromFileElement.value : 'new file'
    const importedFromTooltip = document.getElementById('tooltip_imported_from')
    if (importedFromTooltip) {
        importedFromTooltip.textContent = importedFromFileValue
    }

    // tooltip_imported_at
    const importedAtElement = document.getElementById('imported_at')
    const importedAtValue = importedAtElement ? importedAtElement.value : 'na'
    const importedAtTooltip = document.getElementById('tooltip_imported_at')
    if (importedAtTooltip) {
        importedAtTooltip.textContent = importedAtValue ? `at ${importedAtValue}` : ''
    }

    // return `File Info : Last saved as ${lastSavedAsFilenameValue}`
}

function showFileTooltip() {
    updateFileTooltip()
    const tooltipDatadiv = document.getElementById('tooltip_datadiv')
    if (tooltipDatadiv) {
        tooltipDatadiv.classList.remove('hiddenTooltip')
        tooltipDatadiv.classList.remove('displayedTooltip')
        tooltipDatadiv.classList.add('displayedTooltip')
    }
}

function hideFileTooltip() {
    const tooltipDatadiv = document.getElementById('tooltip_datadiv')
    if (tooltipDatadiv) {
        tooltipDatadiv.classList.remove('hiddenTooltip')
        tooltipDatadiv.classList.remove('displayedTooltip')
        tooltipDatadiv.classList.add('hiddenTooltip')
    }
}



window.onload = function () {
    window.onbeforeprint = function () {
        console.log('Printing');
        const controlsDiv = document.querySelector('.controls-div');
        controlsDiv.classList.remove('display-block');
        controlsDiv.classList.add('display-none');
    }
    window.onafterprint = function () {
        console.log('After printing');
        const controlsDiv = document.querySelector('.controls-div');
        controlsDiv.classList.remove('display-none');
        controlsDiv.classList.add('display-block');
    }
    const importButton = document.getElementById("importButton");
    if (importButton) {
        importButton.addEventListener("click", importData);
    }
    const exportButton = document.getElementById("exportButton");
    if (exportButton) {
        exportButton.addEventListener("click", exportData);
    }
    const fileInfoTooltip = document.getElementById('file_tooltip_content')
    if (fileInfoTooltip) {
        fileInfoTooltip.addEventListener("mouseenter", () => {
            showFileTooltip()
        });
        fileInfoTooltip.addEventListener("mouseleave", () => {
            hideFileTooltip()
        });
    }

    const fileInput = document.getElementById("importFileElement")
    if (fileInput) {
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            const importedFilename = file.name
            const reader = new FileReader();
            reader.onload = function (e) {
                const contents = e.target.result;
                const data = JSON.parse(contents);
                console.table(data);
                data.forEach(d => {
                    updateDataElement(d.id, d.value);
                });
            }
            reader.readAsText(file);

            const importedFromFileElement = document.getElementById('imported_from_filename')
            if (importedFromFileElement) {
                importedFromFileElement.value = importedFilename
            }

            const lastSavedAsFilename = document.getElementById('last_saved_as_filename')
            if (lastSavedAsFilename) {
                lastSavedAsFilename.value = 'not saved'
            }

            const importedAtElement = document.getElementById('imported_at')
            if (importedAtElement) {
                importedAtElement.value = new Date().toLocaleDateString();
            }
            
        });
    }
}
