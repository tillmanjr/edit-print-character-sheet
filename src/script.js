const releaseNotes = new Object(
    {
    v1_0_0: ``,
    v1_0_1: ``,
    v1_1_0: `v1.1.0
Changes:
  Add release notes (releaseNotes) to script.
  Swapped order of Import Export buttons
    - (Import) (Save)
  Changed Export button label to Save
  Add Imported From filename and Imported At tracking.
    Stored in exported JSON.
  Add Saved As filename and Saved At (when) tracking
  Added info tooltip displaying:
    - Imported from filename and when
    - Saved as filename and when
  Tooltip for SavedAt and Imported At include locale date and time
  Added 🛈 "information circle" onhover tooltip trigger to Control Panel
    - | (Import)  (Save)  🛈 |
  Added Character level and current date to generated Save Filename 
    format: CharacterName-Campaign-Setting-CharacterLevel-CurrentDate
  Referenced elements' IDs referenced via constants
    - hiddenElementIds
    - tooltipElementIds
    - controlElementIds
  Referenced CSS classes referenced by constants
    - cssClasses
  Decomposed monolithic event linking into discrete functions
    - connectControlPanelPrintingVisibilty
    - connectImportButton
    - connectSaveButton
    - connectTooltip
    - connectImportHandler
  Refactor repetitive code in tooltip updating
    - updateTextContentFromHidden
  Improved consistency and clarity of element IDs and CSS classes
    `,
    v1_1_1: `v1.1.0
    Fixed bug where hidden tooltip was blocking edit access to a few inputs.
    Adding images to /assets
    Added README.md with basics and images
    `
    }
)
// class used by all elements that have data
const dataElementClass = "has-data";
// All elements having data. 
// Keyed by element id with value as property used to store the data
const dataLocations = Object.freeze({
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
})

const hiddenElementIds = Object.freeze({
    sourceVersion: "fixed_source_version",
    importedFrom: "imported_from_filename",
    importedAt: "imported_at",
    savedAs: "last_saved_as_filename",
    savedAt: "last_saved_at"
})

const tooltipElementIds = Object.freeze({
    dataDiv: "tooltip_datadiv",
    dataImportedFrom: "tooltip_imported_from",
    dataImportedAt: "tooltip_imported_at",
    dataSavedAs: "tooltip_saved_as",
    dataSavedAt: "tooltip_saved_at",
    dataVersion: "tooltip_version"
})

const controlElementIds = Object.freeze({
    controlPanel: "control_panel",
    buttons: {
        import: "importButton",
        save: "exportButton"
    },
    tooltipTrigger: "tt_trigger"
})

const cssClasses = Object.freeze({
    tooltip: {
        hidden: "hiddenTooltip",
        displayed: "displayedTooltip"
    },
    controlPanel: {
        hidden: "display-none",
        displayed: 'display-block'
    }
})

function updateHiddenElementValue ({hiddenElementId, value}) {
    const hiddenElement = document.getElementById(hiddenElementId)
    if (hiddenElement) {
        hiddenElement.value = value
    }
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
        {data_file_version: document.getElementById(hiddenElementIds.sourceVersion).value},
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
    document.body.appendChild(downloadAnchorNode);
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

        const lastSavedAsFilename = document.getElementById(hiddenElementIds.savedAs)
        if (lastSavedAsFilename) {
            lastSavedAsFilename.value = saveFileName
        }

        const lastSavedAt = document.getElementById(hiddenElementIds.savedAt)
        if (lastSavedAt) {
            const lastSavedAtStr = new Date().toLocaleString()
            lastSavedAt.value = lastSavedAtStr
        }
    }
}

function updateTextContentFromHidden({
    fromHiddenId,
    toContentId,
    defaultHiddenValue,
    contentValuePrefix
}) {
    const hiddenElement = document.getElementById(fromHiddenId)
    const hiddenValue = hiddenElement ? hiddenElement.value : defaultHiddenValue
    const contentElement = document.getElementById(toContentId)
    if (contentElement) {
        contentElement.textContent = hiddenValue !== defaultHiddenValue ? `${contentValuePrefix}${hiddenValue}` : hiddenValue
    }
}

function updateFileTooltip() {
    // tooltip_saved_as
    updateTextContentFromHidden({
        fromHiddenId: hiddenElementIds.savedAs,
        toContentId: tooltipElementIds.dataSavedAs,
        defaultHiddenValue: 'not saved',
        contentValuePrefix: ''
    })

    // tooltip_saved_at
    updateTextContentFromHidden({
        fromHiddenId: hiddenElementIds.savedAt,
        toContentId: tooltipElementIds.dataSavedAt,
        defaultHiddenValue: '',
        contentValuePrefix: 'at '
    })

    // tooltip_imported_from
    updateTextContentFromHidden({
        fromHiddenId: hiddenElementIds.importedFrom,
        toContentId: tooltipElementIds.dataImportedFrom,
        defaultHiddenValue: 'new file',
        contentValuePrefix: ''
    })

    // tooltip_imported_at
    updateTextContentFromHidden({
        fromHiddenId: hiddenElementIds.importedAt,
        toContentId: tooltipElementIds.dataImportedAt,
        defaultHiddenValue: '',
        contentValuePrefix: 'at '
    })

    updateTextContentFromHidden({
        fromHiddenId: hiddenElementIds.sourceVersion,
        toContentId: tooltipElementIds.dataVersion,
        defaultHiddenValue: '',
        contentValuePrefix: 'v'
    })
}

function importFileHandler(event) {
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

    updateHiddenElementValue({
        hiddenElementId: hiddenElementIds.importedFrom,
        value: importedFilename
    })

    updateHiddenElementValue({
        hiddenElementId: hiddenElementIds.importedAt,
        value: new Date().toLocaleString()
    })

    updateHiddenElementValue({
        hiddenElementId: hiddenElementIds.savedAs,
        value: 'not saved'
    })
}

function showFileTooltip() {
    updateFileTooltip()
    const tooltipDatadiv = document.getElementById(tooltipElementIds.dataDiv)
    if (tooltipDatadiv) {
        tooltipDatadiv.classList.remove(cssClasses.tooltip.hidden)
        tooltipDatadiv.classList.remove(cssClasses.tooltip.displayed)
        tooltipDatadiv.classList.add(cssClasses.tooltip.displayed)
    }
}

function hideFileTooltip() {
    const tooltipDatadiv = document.getElementById(tooltipElementIds.dataDiv)
    if (tooltipDatadiv) {
        tooltipDatadiv.classList.remove(cssClasses.tooltip.hidden)
        tooltipDatadiv.classList.remove(cssClasses.tooltip.displayed)
        tooltipDatadiv.classList.add(cssClasses.tooltip.hidden)
    }
}

function showControlPanel() {
    const controlsDiv = document.getElementById(controlElementIds.controlPanel);
    controlsDiv.classList.remove(cssClasses.controlPanel.hidden);
    controlsDiv.classList.add(cssClasses.controlPanel.displayed);    
}

function hideControlPanel(event) {
    const controlsDiv = document.getElementById(controlElementIds.controlPanel);
    controlsDiv.classList.remove(cssClasses.controlPanel.displayed);
    controlsDiv.classList.add(cssClasses.controlPanel.hidden);
}

function connectImportButton() {
    const importButton = document.getElementById(controlElementIds.buttons.import);
    if (importButton) {
        importButton.addEventListener("click", importData);
    }
}

function connectSaveButton() {
    const exportButton = document.getElementById(controlElementIds.buttons.save);
    if (exportButton) {
        exportButton.addEventListener("click", exportData);
    }
}

function connectTooltip() {
    const fileInfoTooltip = document.getElementById(controlElementIds.tooltipTrigger)
    if (fileInfoTooltip) {
        fileInfoTooltip.addEventListener("mouseenter", () => {
            showFileTooltip()
        });
        fileInfoTooltip.addEventListener("mouseleave", () => {
            hideFileTooltip()
        });
    }
}

function connectImportFileHandler() {
    const fileInput = document.getElementById("importFileElement")
    if (fileInput) {
        fileInput.addEventListener("change", importFileHandler);
    }
}

function connectControlPanelPrintingVisibilty() {
    window.addEventListener('beforeprint', hideControlPanel)
    window.addEventListener('afterprint', showControlPanel)
}

window.onload = function () {
    connectControlPanelPrintingVisibilty()
    connectImportButton()
    connectSaveButton()
    connectTooltip()
    connectImportFileHandler()
}
