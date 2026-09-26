// Part B. TouchSight's answers: one entry per part label (lowercased), used by ai.ts.
export interface Answer {
  explain: string // copy of the region's `explanation` from the figure JSON, verbatim
  what: string // what is it / what does it do
  why: string // why does it matter / why is it there / why is it shaped like that
  where: string // where it is, in the diagram's own terms
  size: string // how big it is, compared with something a kid knows
  fact: string // one surprising, true, kid-friendly fact
  capital?: string // Canada entries ONLY: "The capital of X is Y." plus at most one short extra clause
}

export const answers: Record<string, Answer> = {
  'plasma membrane': {
    explain: 'The plasma membrane is the thin skin around the cell. It controls what goes in and what comes out.',
    what: "It's the cell's outer boundary, like skin wrapped around your whole body, holding everything else inside.",
    why: 'Without it the cell would fall apart. It lets in food and oxygen but keeps out things that could harm the cell.',
    where: "It's the outer edge, wrapping all the way around the cell like a bag holding everything else inside.",
    size: "It's thinner than a soap bubble's skin, only a few molecules thick, far too thin to feel.",
    fact: 'The membrane is built like a sandwich made of fat, and it can heal itself if it gets a small tear.'
  },
  cytoplasm: {
    explain: 'Cytoplasm is the jelly that fills the cell. All the other parts float in it.',
    what: "It's the thick, jelly-like fluid inside the cell. Every other part sits inside it, like fruit in gelatin.",
    why: 'It gives the cell its shape and lets its parts move around and reach each other to get work done.',
    where: "It fills the whole space inside the membrane, everywhere that isn't the nucleus or another part.",
    size: 'It takes up most of the cell, more space than every other part put together.',
    fact: 'Cytoplasm is mostly water, like a glass of water with thousands of tiny parts stirred into it.'
  },
  nucleus: {
    explain: 'The nucleus is the control centre of the cell. It holds the DNA, the instructions that tell the cell what to do.',
    what: "It's the cell's control room. It holds the DNA and decides what the cell builds and does.",
    why: 'The DNA inside has to be protected and kept separate, so the nucleus locks it safely away.',
    where: 'It sits left of centre, a rounded shape near the middle of the cell, with the rough ER wrapped around it.',
    size: "It's the biggest part inside the cell, like a yolk sitting in the middle of an egg.",
    fact: 'If you stretched out all the DNA packed inside one nucleus, it would be about two metres long.'
  },
  nucleolus: {
    explain: 'The nucleolus is a dark spot inside the nucleus. It builds ribosomes, the tiny machines that make proteins.',
    what: "It's a small, dense spot inside the nucleus that builds ribosomes, the machines that make proteins.",
    why: 'The cell needs a steady supply of ribosomes, so it keeps one spot dedicated to building them.',
    where: "It's tucked inside the nucleus, off to one side, a small dense patch inside the bigger round shape.",
    size: "It's small, just a patch inside the nucleus, like one raisin sitting inside a plum.",
    fact: 'A busy cell can have more than one nucleolus, and the spot disappears while the cell is dividing.'
  },
  chromatin: {
    explain: 'Chromatin is DNA wound into long threads inside the nucleus. It stores the instructions for building the whole body.',
    what: "It's DNA wound up into loose threads inside the nucleus, holding the instructions for the whole body.",
    why: 'Winding the DNA into threads lets a huge amount of information fit into a tiny space.',
    where: 'It fills the inside of the nucleus, threaded around and past the nucleolus.',
    size: 'Uncoiled, the threads in one nucleus would stretch much longer than the cell itself, like thread wound tight into a ball.',
    fact: 'Before a cell divides, chromatin coils up even tighter into short rods called chromosomes.'
  },
  'rough endoplasmic reticulum': {
    explain: 'The rough endoplasmic reticulum is a set of folded tubes around the nucleus. Ribosomes on its surface make proteins here.',
    what: "It's a maze of folded tubes with ribosomes stuck to the outside, busy making proteins.",
    why: 'Keeping ribosomes attached to the tubes lets the cell finish and ship proteins right where they are made.',
    where: 'It wraps around the nucleus like a folded blanket, right next to the smooth ER on one side.',
    size: "It's one of the biggest parts in the cell, folded tubes covering a large area if you spread them flat.",
    fact: "It's called rough because the ribosomes dotting its surface make it feel bumpy, not smooth, under a microscope."
  },
  'smooth endoplasmic reticulum': {
    explain: 'The smooth endoplasmic reticulum is a set of tubes with no ribosomes. It makes fats and helps clear harmful things out of the cell.',
    what: "It's a set of smooth tubes with no ribosomes on them. It makes fats and breaks down harmful chemicals.",
    why: 'Cells need fats for their membranes, and they need a way to clear out things that could poison them.',
    where: 'It sits just to the right of the rough ER, a smaller patch of smooth tubes beside the folded ones.',
    size: "It's smaller than its rough neighbour, a compact patch tucked right beside it.",
    fact: "In liver cells, the smooth ER works hard breaking down alcohol and other chemicals from what a person eats or drinks."
  },
  ribosomes: {
    explain: 'Ribosomes are tiny dots that build proteins. Some float free in the cytoplasm, and others stick to the rough endoplasmic reticulum.',
    what: "They're tiny, dot-shaped machines that build proteins by reading instructions copied from the DNA.",
    why: 'Every part of the cell needs proteins to work, so ribosomes stay busy building them all the time.',
    where: 'They cluster near the top left of the nucleus and dot the surface of the rough ER.',
    size: "They're the smallest parts in the whole cell, far tinier than the nucleus or the mitochondrion.",
    fact: 'A single busy cell can hold millions of ribosomes, all building proteins at the same time.'
  },
  mitochondrion: {
    explain: 'The mitochondrion is the power plant of the cell. It turns food and oxygen into energy the cell can use.',
    what: "It's the cell's power plant. It turns food and oxygen into energy the cell can use.",
    why: 'Every part of the cell needs energy to work, so it needs a steady source making energy nonstop.',
    where: 'It sits near the top of the cell, a little right of centre, above the nucleus.',
    size: "It's medium-sized, smaller than the nucleus but bigger than a ribosome or a vesicle.",
    fact: 'Busy cells, like muscle cells, pack in far more mitochondria than cells that do not work as hard.'
  },
  'golgi apparatus': {
    explain: 'The Golgi apparatus is a stack of flat sacs. Like a post office, it packs proteins and sends them where they need to go.',
    what: "It's a stack of flat sacs that packages proteins and ships them to wherever the cell needs them.",
    why: "Proteins need to be sorted and labelled correctly, or they'd end up in the wrong place in the cell.",
    where: 'It sits in the lower left of the cell, below the nucleus and near the Golgi vesicles.',
    size: "It's a medium stack, smaller than the nucleus, made of several flat layers pressed together.",
    fact: 'Scientists named it after Camillo Golgi, who first spotted it under a microscope over a hundred years ago.'
  },
  'golgi vesicle': {
    explain: 'Golgi vesicles are small bubbles that carry packed proteins away from the Golgi apparatus.',
    what: "They're small bubbles that carry packed proteins away after the Golgi apparatus finishes sorting them.",
    why: 'Proteins need a safe way to travel through the cell without leaking out into the cytoplasm.',
    where: 'They sit right next to the Golgi apparatus, in the lower left area of the cell.',
    size: "They're tiny, much smaller than the Golgi stack they come from.",
    fact: 'A vesicle is basically a tiny bit of membrane pinched off, sealed up like a little balloon.'
  },
  vacuole: {
    explain: 'A vacuole is a storage bubble. It holds water, food or waste until the cell needs it.',
    what: "It's a storage bubble that holds water, food, or waste until the cell is ready to use it.",
    why: 'Every cell needs somewhere to keep extra supplies or garbage until it is needed or ready to go.',
    where: 'It sits at the bottom centre of the cell, below the nucleus.',
    size: "It's a fair-sized round bubble, bigger than a vesicle but smaller than the nucleus.",
    fact: 'Animal cell vacuoles are small, while plant cells often have one giant vacuole that fills most of the cell.'
  },
  peroxisome: {
    explain: 'Peroxisomes are small bubbles that break down fats and get rid of harmful chemicals.',
    what: "They're small bubbles that break down fats and clean up harmful chemicals inside the cell.",
    why: 'Breaking down fat and clearing out harmful byproducts keeps the rest of the cell safe and working well.',
    where: 'It sits near the bottom of the cell, right of centre, close to the vacuole.',
    size: "It's small, close in size to a lysosome, much smaller than the nucleus.",
    fact: 'Peroxisomes get their name because they produce, then break down, hydrogen peroxide, the same chemical in a first-aid bottle.'
  },
  lysosome: {
    explain: 'Lysosomes are the clean-up crew of the cell. They break down worn-out parts and germs.',
    what: "They're the cell's clean-up crew. They break down worn-out parts, leftover bits, and invading germs.",
    why: 'Old parts and germs would pile up and cause harm if nothing in the cell broke them down.',
    where: 'It sits on the right side of the cell, near the microfilament, away from the nucleus.',
    size: "It's a small round bubble, about the same size as a peroxisome.",
    fact: 'Lysosomes carry strong digestive chemicals, powerful enough to break down almost any worn-out part of the cell.'
  },
  centrosome: {
    explain: 'The centrosome sits near the nucleus. It helps pull the DNA apart when the cell divides in two.',
    what: "It's a small structure that helps pull the DNA apart when the cell splits into two new cells.",
    why: 'When a cell divides, each new cell needs a full copy of the DNA, so something has to pull the copies apart evenly.',
    where: 'It sits just to the right of the nucleus, between the nucleus and the microtubules.',
    size: "It's small, tucked into a tight space right beside the nucleus.",
    fact: 'A centrosome copies itself before cell division, so each new cell ends up with its own centrosome.'
  },
  microtubule: {
    explain: 'Microtubules are hollow tubes that help the cell keep its shape. They also work like tracks for moving things around.',
    what: "They're hollow tubes that hold the cell's shape and act like train tracks for moving things around inside.",
    why: 'The cell needs an inner frame to keep from collapsing, and a way to move parts from place to place.',
    where: 'They sit in the upper right area of the cell, near the centrosome and the microfilament.',
    size: "They're long and thin, thinner than the mitochondrion but stretching further across the cell.",
    fact: 'Microtubules can grow longer or fall apart quickly, letting the cell rebuild its frame within minutes.'
  },
  microfilament: {
    explain: 'Microfilaments are very thin threads just inside the membrane. They help the cell move and change shape.',
    what: "They're very thin threads just inside the membrane that help the cell move and change its shape.",
    why: 'A cell that can push and pull its own edges can crawl, change shape, or squeeze through tight spaces.',
    where: "It's a long, curved strip along the right side of the cell, just inside the membrane.",
    size: "It's the thinnest of the three fibre types, but it runs a long way along the edge.",
    fact: 'Microfilaments are made of a protein called actin, the same protein that helps muscles squeeze and contract.'
  },
  'intermediate filament': {
    explain: 'Intermediate filaments are strong ropes inside the cell. They help it hold its shape when it is pushed or pulled.',
    what: "They're strong, rope-like fibres that help the cell hold its shape when it gets pushed or pulled.",
    why: 'A cell gets bumped and stretched all the time, so it needs tough ropes that will not snap easily.',
    where: 'It runs along the upper left, just inside the membrane, above the nucleus.',
    size: "It's medium thickness, thicker than a microfilament but thinner than a microtubule.",
    fact: 'Intermediate filaments are named for sitting in between the other two fibres in thickness, not too thin, not too thick.'
  },
  'secretory vesicle': {
    explain: 'A secretory vesicle is a bubble that carries things to the edge of the cell and lets them out.',
    what: "It's a bubble that carries finished proteins to the edge of the cell and releases them outside.",
    why: 'Some proteins the cell makes are needed outside, like hormones, so they need a way to be delivered there.',
    where: 'It sits near the lower right edge of the cell, tucked into a small pocket of the membrane.',
    size: "It's small, about the same size as a Golgi vesicle.",
    fact: 'When a secretory vesicle reaches the edge, its own membrane joins the cell membrane to release its contents outside.'
  },
  yukon: {
    explain: 'Yukon is in the far northwest, next to Alaska. Its capital is Whitehorse, and summer days are so long it barely gets dark.',
    what: "It's Canada's westernmost territory, a rugged land of mountains and rivers in the far northwest.",
    why: 'Its far northern location and mountains shape a place with long summer days and cold, dark winters.',
    where: 'It sits in the far northwest corner of Canada, bordering Alaska to the west and the Northwest Territories to the east.',
    size: "It's the smallest of the three territories, smaller than British Columbia next door.",
    fact: 'In the middle of summer, the sun barely sets in Yukon, so it can stay light almost all night.',
    capital: 'The capital of Yukon is Whitehorse.'
  },
  'northwest territories': {
    explain: 'The Northwest Territories are in the north. The capital is Yellowknife, where people often see the northern lights dancing in the sky.',
    what: "It's a huge northern territory of forests, lakes, and tundra, with far more lakes than people.",
    why: 'Being so far north gives it clear, dark skies, part of why the northern lights show up so well there.',
    where: 'It sits between Yukon to the west and Nunavut to the east, with Alberta and Saskatchewan to the south.',
    size: 'It stretches across a huge area, though far fewer people live there than in a single big city.',
    fact: 'Great Bear Lake, in the Northwest Territories, is the largest lake found entirely inside Canada.',
    capital: 'The capital of the Northwest Territories is Yellowknife.'
  },
  nunavut: {
    explain: 'Nunavut is the biggest and most northern territory, with many islands. Its capital is Iqaluit, and most people who live there are Inuit.',
    what: "It's Canada's biggest and most northern territory, made up of the mainland and a huge scatter of Arctic islands.",
    why: 'Its name means "our land" in Inuktitut, and it was created so Inuit could govern their own homeland.',
    where: 'It stretches across the far northeast, east of the Northwest Territories, with Hudson Bay along its southern edge.',
    size: "It's the largest territory or province in the whole country, bigger than Ontario and Quebec combined.",
    fact: 'Nunavut only became its own territory in 1999, split off from the Northwest Territories.',
    capital: 'The capital of Nunavut is Iqaluit.'
  },
  'british columbia': {
    explain: 'British Columbia is on the west coast, next to the Pacific Ocean. Its capital is Victoria, on Vancouver Island.',
    what: "It's Canada's westernmost province, a land of mountains, forests, and a long Pacific coastline.",
    why: 'Its coast and mountains bring a milder, wetter climate than most of the rest of Canada.',
    where: 'It sits on the west coast, bordering the Pacific Ocean, with Alberta to the east and Yukon to the north.',
    size: "It's a large province, about as long from north to south as a two-day drive.",
    fact: 'Victoria, the capital, sits on Vancouver Island, an island you can only reach by ferry or plane.',
    capital: 'The capital of British Columbia is Victoria.'
  },
  alberta: {
    explain: 'Alberta is between British Columbia and Saskatchewan. Its capital is Edmonton, and the Rocky Mountains run along its west side.',
    what: "It's a prairie province known for ranches, farmland, and the Rocky Mountains along its western edge.",
    why: 'The Rocky Mountains on its west side block moisture, part of why its plains stay so dry and sunny.',
    where: 'It sits between British Columbia to the west and Saskatchewan to the east, south of the Northwest Territories.',
    size: "It's mid-sized among the provinces, close in size to its neighbour Saskatchewan.",
    fact: "The Rocky Mountains along Alberta's western border include Banff, Canada's first and oldest national park.",
    capital: 'The capital of Alberta is Edmonton.'
  },
  saskatchewan: {
    explain: 'Saskatchewan is shaped almost like a rectangle, in the middle of the prairies. Its capital is Regina, and its farms grow lots of wheat.',
    what: "It's a prairie province covered in farmland, known for growing huge amounts of wheat and other grains.",
    why: 'Its flat, fertile land is part of why it became one of the biggest farming regions in the country.',
    where: 'It sits between Alberta to the west and Manitoba to the east, in the middle of the prairies.',
    size: "It's mid-sized among the provinces, close in size to its neighbour Alberta.",
    fact: 'Saskatchewan is one of only two provinces with no ocean coastline, and its borders are almost perfectly straight lines.',
    capital: 'The capital of Saskatchewan is Regina.'
  },
  manitoba: {
    explain: 'Manitoba is the most eastern prairie province. Its capital is Winnipeg, and polar bears visit the town of Churchill on Hudson Bay.',
    what: "It's the easternmost prairie province, with farmland in the south and Hudson Bay along its north.",
    why: 'Its stretch of Hudson Bay coastline is part of why polar bears pass through the northern town of Churchill.',
    where: 'It sits between Saskatchewan to the west and Ontario to the east, with Hudson Bay to the north.',
    size: "It's smaller than its prairie neighbours, but still much bigger than any of the Atlantic provinces.",
    fact: 'Churchill, Manitoba, is nicknamed the polar bear capital of the world because bears gather near the town each fall.',
    capital: 'The capital of Manitoba is Winnipeg.'
  },
  ontario: {
    explain: 'Ontario is in the middle of Canada. Its capital is Toronto, and Ottawa, the capital of the whole country, is here too.',
    what: "It's a central province home to Toronto, Canada's largest city, and Ottawa, the country's capital.",
    why: 'Its central location and large cities are part of why so many people and businesses are based there.',
    where: 'It sits between Manitoba to the west and Quebec to the east, bordering the Great Lakes to the south.',
    size: 'It is one of the larger provinces, and more people live here than in any other province.',
    fact: 'Ontario has more people than any other province, even though Quebec covers more land.',
    capital: 'The capital of Ontario is Toronto, though Ottawa, in eastern Ontario, is the capital of Canada.'
  },
  quebec: {
    explain: 'Quebec is the biggest province. Its capital is Québec City, and most people there speak French.',
    what: "It's the largest province by area, where most people speak French as their first language.",
    why: "Quebec's French-speaking history goes back to early French settlers, and that language and culture stayed strong there.",
    where: 'It sits east of Ontario, with Hudson Bay to the north and New Brunswick and the Atlantic Ocean to the east.',
    size: 'It is the biggest province in the whole country, bigger than Ontario and every other province.',
    fact: "Québec City's old town is surrounded by stone walls, the only walled city left in North America north of Mexico.",
    capital: 'The capital of Quebec is Québec City.'
  },
  'newfoundland and labrador': {
    explain: "Newfoundland and Labrador is on the east coast, in two parts: an island and a piece of the mainland. Its capital is St. John's.",
    what: "It's Canada's most easterly province, made up of an island and a mainland piece called Labrador.",
    why: 'Being split into an island and a mainland part is part of why it has such a long, varied coastline.',
    where: 'It sits at the far east edge of Canada, north of Nova Scotia, facing the Atlantic Ocean.',
    size: "It's a mid-sized province, with Labrador alone covering more land than the island part.",
    fact: "St. John's, the capital, is one of the oldest cities in North America, settled by fishers centuries ago.",
    capital: "The capital of Newfoundland and Labrador is St. John's."
  },
  'new brunswick': {
    explain: 'New Brunswick is next to Quebec and Nova Scotia. Its capital is Fredericton, and the Bay of Fundy has the highest tides in the world.',
    what: "It's one of the Maritime provinces, bordered by forests inland and the Bay of Fundy along its coast.",
    why: 'Its location on the Bay of Fundy is why it gets the most extreme tides found anywhere on Earth.',
    where: 'It sits between Quebec to the north and Nova Scotia to the southeast, next to the Bay of Fundy.',
    size: "It's one of the smaller provinces, close in size to its neighbour Nova Scotia.",
    fact: 'The Bay of Fundy has the highest tides on Earth, rising and falling higher than a house in some spots.',
    capital: 'The capital of New Brunswick is Fredericton.'
  },
  'nova scotia': {
    explain: 'Nova Scotia is almost surrounded by the ocean. Its capital is Halifax, and no place in it is far from the sea.',
    what: "It's a Maritime province almost entirely surrounded by ocean, joined to the mainland by a narrow strip of land.",
    why: 'Being nearly surrounded by water is why the ocean shapes daily life in almost every part of the province.',
    where: 'It sits southeast of New Brunswick, jutting out into the Atlantic Ocean, close to Prince Edward Island.',
    size: "It's one of the smaller provinces, bigger than Prince Edward Island but smaller than New Brunswick.",
    fact: 'Halifax, the capital, sits on one of the largest natural harbours in the world.',
    capital: 'The capital of Nova Scotia is Halifax.'
  },
  'prince edward island': {
    explain: 'Prince Edward Island is the smallest province. Its capital is Charlottetown, and it is famous for red soil and potatoes.',
    what: "It's Canada's smallest province, a single island known for red soil and its potato farms.",
    why: 'Its red-tinted soil, full of iron, is part of why the island grows so many potatoes.',
    where: 'It is a small island in the Gulf of St. Lawrence, north of Nova Scotia and east of New Brunswick.',
    size: 'It is the smallest province by far, small enough to drive across in a few hours.',
    fact: 'Prince Edward Island is the setting for the story Anne of Green Gables.',
    capital: 'The capital of Prince Edward Island is Charlottetown.'
  }
}

// Other spellings a teacher might type for the same part.
answers.mitochondria = answers.mitochondrion
answers.ribosome = answers.ribosomes
answers.lysosomes = answers.lysosome
answers.peroxisomes = answers.peroxisome
answers.microtubules = answers.microtubule
answers.microfilaments = answers.microfilament
answers['intermediate filaments'] = answers['intermediate filament']
answers['golgi vesicles'] = answers['golgi vesicle']
answers.golgi = answers['golgi apparatus']
answers['cell membrane'] = answers['plasma membrane']
answers['rough er'] = answers['rough endoplasmic reticulum']
answers['smooth er'] = answers['smooth endoplasmic reticulum']
answers.pei = answers['prince edward island']
answers.bc = answers['british columbia']
answers.nwt = answers['northwest territories']
answers['northwest territory'] = answers['northwest territories']
answers['québec'] = answers.quebec
answers.newfoundland = answers['newfoundland and labrador']
answers.labrador = answers['newfoundland and labrador']
