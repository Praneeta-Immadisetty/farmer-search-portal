const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/textDB", {useNewUrlParser: true});

const TextSchema = new mongoose.Schema ({
    topic: String,
    subTopic: String,
    keywords: [String],
    data: String
});

const Text = mongoose.model("Text", TextSchema);

TextSchema.methods.findData = function(keyword) {
    return mongoose.model('Text').find({ keywords: keyword }).data;
};

// const agr11 = new Text ({
//     topic: "Organic Farming",
//     subTopic: "Advantages",
//     keywords: ["Organic", "Eco-friendly", "Natural"],
//     data: "Organic farming is a production system which avoids or largely excludes the use of synthetically compounded fertilizers, pesticides, growth regulators, genetically modified organisms and livestock food additives. To the maximum extent possible organic farming system rely upon crop rotations, use of crop residues, animal manures, legumes, green manures, off farm organic wastes, biofertilizers, mechanical cultivation, mineral bearing rocks and aspects of biological control to maintain soil productivity and tilth to supply plant nutrients and to control insect, weeds and other pests. Organic methods can increase farm productivity, repair decades of environmental damage and knit small farm families into more sustainable distribution networks leading to improved food security if they organize themselves in production, certification and marketing. During last few years an increasing number of farmers have shown lack of interest in farming and the people who used to cultivate are migrating to other areas. Organic farming is one way to promote either self-sufficiency or food security. Use of massive inputs of chemical fertilizers and toxic pesticides poisons the land and water heavily. The after-effects of this are severe environmental consequences, including loss of topsoil, decrease in soil fertility, surface and ground water contamination and loss of genetic diversity. Organic farming which is a holistic production management system that promotes and enhances agro-ecosystem health, including biodiversity, biological cycles, and soil biological activity is hence important. Many studies have shown that organic farming methods can produce even higher yields than conventional methods. Significant difference in soil health indicators such as nitrogen mineralization potential and microbial abundance and diversity, which were higher in the organic farms can also be seen. The increased soil health in organic farms also resulted in considerably lower insect and disease incidence. The emphasis on small-scale integrated farming systems has the potential to revitalize rural areas and their economies."
// });

// const agr12 = new Text ({
//     topic: "Organic Farming",
//     subTopic: "Crop Diversity",
//     keywords: ["Variety", "Multiple crops"],
//     data: "Organic farming encourages Crop diversity. The science of agroecology has revealed the benefits of polyculture (multiple crops in the same space), which is often employed in organic farming. Planting a variety of vegetable crops supports a wider range of beneficial insects, soil microorganisms, and other factors that add up to overall farm health. Crop diversity helps environments thrive and protects species from going extinct. "
// });

// const agr13 = new Text ({
//     topic: "Organic Farming",
//     subTopic: "Soil Management",
//     keywords: ["Earthworms", "Composting", "Green manure"],
//     data: "Organic farming relies more heavily on the natural breakdown of organic matter than the average conventional farm, using techniques like green manure and composting, to replace nutrients taken from the soil by previous crops. This biological process, driven by microorganisms such as mycorrhiza and earthworms, releases nutrients available to plants throughout the growing season. Farmers use a variety of methods to improve soil fertility, including crop rotation, cover cropping, reduced tillage, and application of compost. By reducing fuel-intensive tillage, less soil organic matter is lost to the atmosphere. This has an added benefit of carbon sequestration, which reduces greenhouse gases and helps reverse climate change. Reducing tillage may also improve soil structure and reduce the potential for soil erosion."
// });

// const agr21 = new Text ({
//     topic: "Irrigation",
//     subTopic: "Drip Irrigation",
//     keywords: ["Efficient", "drop by drop"],
//     data: "Drip (or micro) irrigation, also known as trickle irrigation, functions as its name suggests. In this system water falls drop by drop just at the position of roots. Water is delivered at or near the root zone of plants, drop by drop. This method can be the most water-efficient method of irrigation, if managed properly, evaporation and runoff are minimized. The field water efficiency of drip irrigation is typically in the range of 80 to 90 percent when managed correctly."
// });

// const agr22 = new Text ({
//     topic: "Irrigation",
//     subTopic: "Sprinkler Irrigation",
//     keywords: ["sprayers", "rotating"],
//     data: "In sprinkler or overhead irrigation, water is piped to one or more central locations within the field and distributed by overhead high-pressure sprinklers or guns. A system using sprinklers, sprays, or guns mounted overhead on permanently installed risers is often referred to as a solid-set irrigation system. Higher pressure sprinklers that rotate are called rotors and are driven by a ball drive, gear drive, or impact mechanism. Rotors can be designed to rotate in a full or partial circle. Guns are similar to rotors, except that they generally operate at very high pressures of 275 to 900 kPa (40 to 130 psi) and flows of 3 to 76 L/s (50 to 1200 US gal/min), usually with nozzle diameters in the range of 10 to 50 mm (0.5 to 1.9 in). Guns are used not only for irrigation, but also for industrial applications such as dust suppression and logging."
// });

// const agr23 = new Text ({
//     topic: "Irrigation",
//     subTopic: "Center pivot irrigation",
//     keywords: ["circular irrigation", "use of electric motors"],
//     data: "Center-pivot irrigation (sometimes called central pivot irrigation), also called water-wheel and circle irrigation, is a method of crop irrigation in which equipment rotates around a pivot and crops are watered with sprinklers. A circular area centered on the pivot is irrigated, often creating a circular pattern in crops when viewed from above (sometimes referred to as crop circles, not to be confused with those formed by circular flattening of a section of a crop in a field). Most center pivots were initially water-powered, however today most are propelled by electric motors."
// });

// const agr31 = new Text ({
//     topic: "Agricultural Machinery",
//     subTopic: "Tractors",
//     keywords: ["tillage", "soil loosening"],
//     data: "Tractors do the majority of work on a modern farm. They are used to push/pull implements—machines that till the ground, plant seed, and perform other tasks. Tillage implements prepare the soil for planting by loosening the soil and killing weeds or competing plants. The best-known is the plow, the ancient implement that was upgraded in 1838 by John Deere. Plows are now used less frequently in the U.S. than formerly, with offset disks used instead to turn over the soil, and chisels used to gain the depth needed to retain moisture."
// });

// const agr32 = new Text ({
//     topic: "Agricultural Machinery",
//     subTopic: "Combines",
//     keywords: ["harvest", "reaping", "threshing", "winnowing"],
//     data: "Combine is a machine designed to efficiently harvest a variety of grain crops. The name derives from its combining four separate harvesting operations—reaping, threshing, gathering, and winnowing—into a single process. Among the crops harvested with a combine are wheat, rice, oats, rye, barley, corn (maize), sorghum, soybeans, flax (linseed), sunflowers and rapeseed."
// });

// const agr33 = new Text ({
//     topic: "Agricultural Machinery",
//     subTopic: "Planters",
//     keywords: ["seeder", "transplanters"],
//     data: "The most common type of seeder is called a planter, and spaces seeds out equally in long rows, which are usually two to three feet apart. Some crops are planted by drills, which put out much more seed in rows less than a foot apart, blanketing the field with crops. Transplanters automate the task of transplanting seedlings to the field. With the widespread use of plastic mulch, plastic mulch layers, transplanters, and seeders lay down long rows of plastic, and plant through them automatically."
// });

// const agr41 = new Text ({
//     topic: "Fertilizers",
//     subTopic: "Single nutrient fertilizers",
//     keywords: ["nitrogen-based", "urea"],
//     data: "The main nitrogen-based straight fertilizer is ammonia or its solutions. Ammonium nitrate (NH4NO3) is also widely used. Urea is another popular source of nitrogen, having the advantage that it is solid and non-explosive, unlike ammonia and ammonium nitrate, respectively. A few percent of the nitrogen fertilizer market (4% in 2007) has been met by calcium ammonium nitrate (Ca(NO3)2 • NH4 • 10H2O)."
// });

// const agr42 = new Text ({
//     topic: "Fertilizers",
//     subTopic: "Multinutrient fertilizers",
//     keywords: ["npk", "compound npk"],
//     data: "NPK fertilizers are three-component fertilizers providing nitrogen, phosphorus, and potassium. There exist two types of NPK fertilizers: compound and blends. Compound NPK fertilizers contain chemically bound ingredients, while blended NPK fertilizers are physical mixtures of single nutrient components."
// });

// const agr43 = new Text ({
//     topic: "Fertilizers",
//     subTopic: "Micronutrients",
//     keywords: ["small quantities", "boron", "zinc"],
//     data: "Micronutrients are consumed in smaller quantities and are present in plant tissue on the order of parts-per-million (ppm), ranging from 0.15 to 400 ppm or less than 0.04% dry matter. These elements are often required for enzymes essential to the plant's metabolism. Because these elements enable catalysts (enzymes), their impact far exceeds their weight percentage. Typical micronutrients are boron, zinc, molybdenum, iron, and manganese. These elements are provided as water-soluble salts. Iron presents special problems because it converts to insoluble (bio-unavailable) compounds at moderate soil pH and phosphate concentrations. For this reason, iron is often administered as a chelate complex, e.g., the EDTA or EDDHA derivatives. The micronutrient needs depend on the plant and the environment. For example, sugar beets appear to require boron, and legumes require cobalt, while environmental conditions such as heat or drought make boron less available for plants."
// });

// const agr51 = new Text ({
//     topic: "Dairy Farming",
//     subTopic: "Dairy cattle",
//     keywords: ["cows", "bull", "calf"],
//     data: "India has the world's largest dairy herd with over 300 million bovines, producing over 187 million tonnes of milk. India is first among all countries in both production and consumption of milk. Most of the milk is domestically consumed, though a small fraction is also exported. Indian cuisine, in particular North Indian cuisine, features a number of dairy products like paneer, while South Indian cuisine uses more yogurts and milk. Milk and dairy products play a part in Hindu religious practice and legend."
// });

// const agr52 = new Text ({
//     topic: "Dairy Farming",
//     subTopic: "Cattle and dairy production",
//     keywords: ["dairy regulation", "DAH&D"],
//     data: "The key regulatory body for dairy production is the Department of Animal Husbandry and Dairying (DAH&D), which is under the Ministry of Animal Husbandry, Dairying and Fisheries. Prior to 1991, dairy was managed within a division of the Ministry for Agriculture; a separate department was established in order to combine dairy-related functions from the Agriculture and Food Processing Ministries. DAH&D manages livestock and deals with matters concerning the development of the dairy industry. It is also the managing authority for the National Dairy Development Board (NDDB), a research institute established by Verghese Kurien to finance and develop the Indian dairy industry. The NDDB also administers the National Dairy Plan on behalf of the government of India. Within DAH&D, the Cattle Division focuses on dairy development.[113] Since 2014, the birthday of Verghese Kurien, 26 November, has been commemorated as National Milk Day."
// });

// const agr53 = new Text ({
//     topic: "Dairy Farming",
//     subTopic: "Adulteration and food safety",
//     keywords: ["adulteration", "synthetic milk"],
//     data: "Synthetic milk – a mixture of urea detergent powder, vegetable oil, fat, and salt, and water – has been sold openly as milk in the northern Indian states. The mixture has colour and fat content similar to that of natural milk, but can be produced at a fraction of the price. Adulteration of ghee, sweets and other dairy products with lard and animal fats is common in India. Rampant adulteration has been observed during the festive season when the demand for sweets and other milk products increases. The Supreme Court of India has favoured life imprisonment as the maximum penalty for milk adulteration, and this has been implemented in Uttar Pradesh, West Bengal and Odisha."
// });

// Text.insertMany([agr12, agr13, agr21, agr22, agr23, agr31, agr32, agr33, agr41, agr42, agr43, agr51, agr52, agr53], function(err){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Success!!");
//     }
// });
//agr1.save();