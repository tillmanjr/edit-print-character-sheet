

## Keys:
Keys are composed in a structured manner.
Key segments are sepated by dbl underscore.
#### All Keys  
All keys are prefixed with `character_app`   
#### User-specific keys, users are referred to as players
Data specific to individual users will have keys beginning with the app prefix followed by user's player name
_e.g._ for player named RogerRamjet `character_app__RogerRamjet`  
This will be followed by functionality specific keys  
_e.g._ The list of character names belonging to a player named RogerRamjet `character_app__RogerRamjet__character_names`


## Collections
### Lists  
### player_names`
- key: `<app_prefix>__names`  
- data type: `string`

### character_names - by player
- key: `<app_prefix>__<player.player_name>__character_names`  
- data type: `string`

### characters - by player
- key: `<app_prefix>__<player.player_name>__characters`  
- data type: `<Character>`




## Entities


### Player - one unique entry per by player
Interactive user as player 
- key: - key: `<app_prefix>__<player_name>
- value: <PlayerData>
TYPE:PlayerData
- `player_name` = string  

### Character   
- `character_name` `<string>`  
- `player_name` `<string>` - relationship to a Player

### CharacterData - one unique entry per by player__character_name
- key: `<app_prefix>__<player.player_name>__character_data__character_name`  
- data type: `<CharacterSheet>`


### TYPE: CharacterSheet
- `character_name`  `<string>`  
- `player_name`     `<string>` - relationship to a Player
- `date` 			`<string>`	
- `race` 			`<string>`	
- `class` 			`<string>`	
- `level` 			`<string>`	
- `xp` 			    `<string>`	
- `weapons` 		`<string>`	
- `equipment` 		`<string>`	
- `page1_notes1` 	`<string>`	
- `page1_notes2`	`<string>`	
- `str` 			`<string>`	
- `str_mod` 		`<string>`	
- `int` 	    	`<string>`	
- `int_mod` 		`<string>`	
- `wis` 			`<string>`	
- `wis_mod` 		`<string>`	
- `dex` 			`<string>`	
- `dex_mod` 		`<string>`	
- `con` 			`<string>`	
- `con_mod` 		`<string>`	
- `cha` 			`<string>`	
- `cha_mod` 		`<string>`	
- `death` 			`<string>`	
- `death_mod` 		`<string>`	
- `wands` 			`<string>`	
- `wands_mod` 		`<string>`	
- `petrify` 		`<string>`	
- `petrify_mod` 	`<string>`	
- `breath` 			`<string>`	
- `breath_mod` 		`<string>`	
- `spells` 			`<string>`	
- `spells_mod` 		`<string>`	
- `campaign` 		`<string>`	
- `setting` 		`<string>`	
- `ac` 		    	`<string>`	
- `move` 			`<string>`	
- `hp` 			    `<string>`	
- `attack_bonus` 	`<string>`	
- `money` 			`<string>`	
- `backstory` 		`<string>`	
- `notes` 			`<string>`	
- `morenotes` 		`<string>`	
- `evenmorenotes` 	`<string>`	




character_name,
player_name,

date,
race,
class,
level,
xp,
weapons,
equipment,
page1_notes1,
page1_notes2,
str,
str_mod,
int,
int_mod,
wis,
wis_mod,
dex,
dex_mod,
con,
con_mod,
cha,
cha_mod,
death,
death_mod,
wands,
wands_mod,
petrify,
petrify_mod,
breath,
breath_mod,
spells,
spells_mod,
campaign,
setting,
ac,
move,
hp,
attack_bonus,
money,
backstory,
notes,
morenotes,
evenmorenotes