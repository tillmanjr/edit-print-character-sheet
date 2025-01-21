
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

                const saveFileName = `${saveCharName}-${saveCampaign}-${saveSetting}.json`
                console.log('Exporting data to ', saveFileName)
                exportJSONToFile(data, saveFileName);
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
            const fileInput = document.getElementById("importFileElement")
            if (fileInput) {
                fileInput.addEventListener("change", (event) => {
                    const file = event.target.files[0];
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
                });
            }
        }
