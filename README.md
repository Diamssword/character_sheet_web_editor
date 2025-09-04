# Character Sheet Web Editor
This project allow you to deploy your own web editor for the Minecraft mod ([Character Sheet](https://modrinth.com/mod/character-sheet))  
It is, as of now, an obligation for the mod to work properly.

# Quickstart
You can grab a build of the website under the 'releases' tab and unzip it somewhere.  
This website require node 20.19.4 or higher to work.  
You will need to provide this 2 environement variables:
 - API_SECRET_KEY : the secret key for the api of the mod
 - API_PUBLIC_KEY : the public key for the api of the mod (the one you will put in the mod's config on the server side)

You can define them in the .env at the root folder or any other way you want  
You can also set the PORT variable (but you can't use the .env for this since it is required at before the launch of the website)  
For more variable you can follow the guideline for the [SvelteKit Node Adapter](https://svelte.dev/docs/kit/adapter-node)  
To start the website, simply use `node build/index.js`  

# Customization and editor's datas
There is a `datas` folder at the root of the project, it is where most of the editor functionalities can be tweaked
Note: due to caching, changes to file may take up to 10 minutes to appear on your webiste, you can resolve this issues by disabeling cache on your browser.
 ## Custom
 This folder contain different files template that you can edit, like the website icon, skin viewer background image, translation of the webiste and the landing page.  
 The landing.html can be removed if you want the website to directly send you to the skin editor, or modifed at will.
 ## Skins
 The `skins` folder contains a serie of subfolder and textures used for rendering the different parts of the player's skin.  
 The name and position of folders are determinated by the structure of your `layers.json`

 ## Skins Display
 The Skin Display folder contains the vigniette of your skin parts, it is automaticlly populated when using the /dev/genskinpic route of the website.  
 You should use this route everytime you modify the content of the `skins` folder, this route is locked behing the API_PUBLIC_KEY to prevent anyone other than you to use it.

 ## Skills
 `skills.json` is where you will define the different skills availables to your players, this file content must be the same than in your mod's datapack. 

 ## Factions
 `factions.json` is where you will define the different factions to choose from, a faction is used to pre-fill some of your player skills in 3 steps:
  - First, the Faction itself:  each members of this factions will get a number of points in a list of skills as defined in the 'bonus' field
  - Second, the Origin : a place of birth, city, tribe... inside the faction, give another additional number of points in any skills you want
  - Last, the Job: another chance to give more diverse points.
You dont have to give points for certains jobs, origins of faction, you can leve the field empty!  
## Layers
`layers.json` define how the skin parts work, the only constant here is the `base`, it must always exist and allow you to define an extra field: `skinRes` as an integer, a multiple of 2, it will be the resolution of the ouputed skin as well as the max resolution of your assets (you can have lower res assets too!) 
The fields are as follow:  
 - name: the technical name of the layer, used internally to define an save datas, it is recommended to not alter it after definiton to preven losing datas when a player want to load an old save.
 - display: the Human-readable name, can be whatever you want.
 - clearable: if set to true, allow the user to wear nothing on this layer
 - size : define the scale of the layer on the skin, making it bigger make the layer further away from the base model
 - external : this settings will allow you to set a default but editable layer in game: the texture will not be stiched in the final skin image and can be changed later in-game (useful for underwear of hairs)
 - multi : if set to true, the player can add as much iteration of this layer on his skin, the layers will all be stiched into one when the skin is exported (useful for makeup or scars )
 - splited : if set to true, allow the user to split the textures layer in 2, and choose one texture for the left side of the player and another for the right side (useful for diffent brows or eyes), this currently only work for the face.
 - displayGen : a parameters for handling the Skins Display generation, allowing different camera angles for the vigniettes this are the availables values:
    - bodyfull: a global view of the player character, with a flat white texture applied to the body under.
    - body: a global view of the player character, no texture under.
    - head: a focus on the head, tilted slightly on the side, no texture under.
    - headfull: a focus on the head, tilted slightly on the side, with a flat white texture applied to the head under
    - headlong : a focus on the head and the upper body of the player, tilted slightly on the side, with a flat white texture applied to the head under
    - face: a focus on the face of the player, with a flat white texture applied to the head under
 - cat : allow you to order the texture in sub-category, where you can specify names and displayGen : `{"the_id":{"name":"The readable name",displayGen:"optional"},"another_cat":{...}}`
