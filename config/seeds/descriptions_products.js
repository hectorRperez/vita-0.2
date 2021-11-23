const SqlBuilder = require("./sql-builder");

const getDescriptionsProducts = function () {
  const descriptions = [
    { id: 1, name: "size" },
    { id: 2, name: "how_to_use" },
    { id: 3, name: "full_ingredient_list" },
    { id: 4, name: "caution" },
    { id: 5, name: "key_benefic" },
    { id: 6, name: "key_ingredients" },
    { id: 7, name: "description" },
    { id: 8, name: "additional_information" },
    { id: 9, name: "instructions" },
    { id: 10, name: "precaution_possible_side_effects" },
  ];

  const result = [];
  for (let i = 0; i < descriptions.length; i++) {
    const message = SqlBuilder.getQueryInsertTable(
      "descriptions_types_products",
      descriptions[i]
    );
    result.push({
      sql: message,
      name: message,
    });
  }

  return result;
};

const getDescriptionsProductsRelations = function () {
  const result = [];
  const relations = [
    {
      product_id: 1,
      descriptions_types_product_id: 1,
      content: "1.0 fl. oz/30 ml",
    },
    {
      product_id: 1,
      descriptions_types_product_id: 2,
      content:
        "After cleansing and toning, apply 1-2 drops of serum to clean fingertips or palm. Using fingertips, gently smooth serum onto clean face and under eyes. Avoid direct contact with eyes. Allow to fully absorb and follow with moisturizer.",
    },
    {
      product_id: 1,
      descriptions_types_product_id: 3,
      content:
        "Purified Water (Agua), Vegan Hyaluronic Acid (Sodium Hyaluronate), Sodium Ascorbyl phosphate, (Stabilized Vitamin C), Vitamin E, Ferulic acid, Organic Cocos Nucifera (Coconut) Oil, Organic Simmondsia Chinensis (Jojoba) Seed Oil, Riboflavin (Vitamin B2), Phenoxyethanol.",
    },
    {
      product_id: 1,
      descriptions_types_product_id: 4,
      content:
        "For external use only. Avoid contact with eyes and mouth. If irritation occurs, discontinue use. Keep out of reach of children",
    },
    {
      product_id: 1,
      descriptions_types_product_id: 5,
      content:
        " Powerful Antioxidant Vitamin C ,May help rejuvenate the appearance of skin toning and firming ,Ferulic & Hyaluronic Acid , \nSpot Correction & Balance Skin-Tone",
    },
    { product_id: 1, descriptions_types_product_id: 6, content: "" },
    { product_id: 2, descriptions_types_product_id: 1, content: "20 ml" },
    {
      product_id: 2,
      descriptions_types_product_id: 2,
      content:
        "Dispense one pump onto fingertips and apply to clean skin. Smooth over entire face, focusing on wrinkle-prone areas.",
    },
    {
      product_id: 2,
      descriptions_types_product_id: 3,
      content:
        "Water (Agua), Carthamus Tinctorius (Organic Safflower) Oil, Emulsifying Wax, Aloe Barbadensis (Organic Aloe) Leaf Juice, Simmondsia Chinesis (Organic Jojoba) Oil, Xanthan Gum, Cocos Nucifera (Organic Coconut) Oil, Tocopheryl Acetate (Vitamin E), Glyceryl Linoleate, Retinyl Palmitate (Vitamin A), Retinol (Vitamin A), Zinc Oxide, Lecithin, Sorbitol, Vanilla Planifolia Extract, Butyrospermum Parkii (Organic Shea Butter), Sodium Hyaluronate (Hyaluronic Acid), Sodium Ascorbate, Panthenol (Vitamin B5), Palmitoyl Oligopeptide, Palmitoyl Tetrapeptide-7, Polysorbate 20, Helianthus Annuus (Organic Sunflower) Oil, Phenoxyethanol, Glycerin, Natural Fragrant Oil, Punica Granatum, (Organic Pomegranate) Oil.",
    },
    {
      product_id: 2,
      descriptions_types_product_id: 4,
      content:
        "For external use only. Avoid contact with eyes and mouth. If irritation occurs, discontinue use. Keep out of reach of children. *This product has natural ingredients and cream/serum color will change.  We do not use bleaching agents to control the color/shade",
    },
    { product_id: 2, descriptions_types_product_id: 5, content: "" },
    {
      product_id: 2,
      descriptions_types_product_id: 6,
      content:
        "Retinol GS50, Matrixyl 3000 Peptides, Hyaluronic Acid, Zinc Oxide, Organic Ingredients",
    },
    {
      product_id: 3,
      descriptions_types_product_id: 1,
      content: "1.0 fl. oz/30 ml",
    },
    {
      product_id: 3,
      descriptions_types_product_id: 2,
      content:
        "Apply 1-2 drops to your fingertips and gently pat and massage onto your face, neck and wrinkle-prone areas.",
    },
    {
      product_id: 3,
      descriptions_types_product_id: 3,
      content:
        "Purified Water (Agua), Vegan Hyaluronic Acid (Sodium Hyaluronate), Organic Cocos Nucifera (Coconut) Oil, Organic Simmondsia Chinensis (Jojoba) Seed Oil, Phenoxyethanol",
    },
    {
      product_id: 3,
      descriptions_types_product_id: 4,
      content:
        "For external use only. Avoid contact with eyes and mouth. If irritation occurs, discontinue use. Keep out of reach of children",
    },
    {
      product_id: 3,
      descriptions_types_product_id: 5,
      content:
        "HYALURONIC ACID is a natural glycosaminoglycan (polysaccharides that are an important component of connective tissue) and is naturally derived. Hyaluronic acid supports healthy skin and helps provide moisture. Hyaluronic acid works as a humectant by retaining water for healthy skin-hydration. This version of Hyaluronic Acid is certified vegan and is produced through wheat-free fermentation",
    },
    {
      product_id: 3,
      descriptions_types_product_id: 6,
      content: "Sodium Hyaluronate, Organic Coconut Oil, Organic Jojoba Oil",
    },
    { product_id: 4, descriptions_types_product_id: 1, content: ".5mm / 1mm" },
    {
      product_id: 4,
      descriptions_types_product_id: 7,
      content:
        "540 titanium over stainless steel micro-needles. Available in either 1.0mm for normal skin or .5mm for sensitive skin",
    },
    { product_id: 4, descriptions_types_product_id: 8, content: "Weight 3 oz" },
    {
      product_id: 4,
      descriptions_types_product_id: 8,
      content: "Dimensions 6.5 x 1.5 x 1 in",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 8,
      content: "Size: .5mm, 1 mm",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content: "Wash your face keep clean and dry.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content: "Do not use roller on lips. Eyelids or mucus membranes.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content:
        "Use gently at first until you know what your skin can tolerate.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content: "The treatment should not be painful and should not draw blood.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content:
        "You will become accustomed to how much pressure you can apply without causing any pain or discomfort.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content:
        "Use every 2-3 days until your skin becomes accustomed, then use no more than once a day.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content:
        "Wash after each you with about 20 minutes with 70% Isopropyl Alcohol.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content: "Store in the clear case when not in use.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content: "Please see our information and instructional video",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 9,
      content: "Roll 4 time in each direction.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content: "Keep out of the reach of children.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content: "Never share the roller with other people.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content: "Keep the applicator always clean.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content:
        "Do not use on sunburn, open cuts, herpes, pustule acne lesions or any other sore areas, inflamed or infected skin.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content:
        "Do not use if you have a history of poor wound healing, skin disease, blood problems, are immunocompromised, are pregnant or lactating, are prone to keloid scarring or have diabetes.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content:
        "IF you are uncertain about your skin condition, please consult a dermatologist before using.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content:
        "Use of roller on open wounds may cause infection. If you develop any skin sensitivity after use, consult your physician.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content:
        "Your skin may redden after use this should go away within a few hours.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content:
        "You may experience some drying of the skin after use and/ or some flaking. If this happens, stop using the roller until the skin returns to normal.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content:
        "In some individuals, slight bleeding may occur, if this could happen, clean the are with warm soapy water, apply antiseptic ointment and allow area to heal before continuing use.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content:
        "Aspirin, Ibuprofen, vitamin E, other supplements and blood thinning drugs can cause increased bruising, please consult your physician if you are taking these medications.",
    },
    {
      product_id: 4,
      descriptions_types_product_id: 10,
      content:
        "Use entirely at your own risk. To the maximum extent permitted by law, we are not responsible for negative or damaging results obtained by proper or improper use of this product. Even though many of our customers have experienced incredibly positive results, we cannot guarantee results.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 1,
      content: "Superior Quality 0.5 mm Needle Size Titanium",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 7,
      content:
        "540 titanium over stainless steel micro-needles. Available in either 1.0mm for normal skin or .5mm for sensitive skin.",
    },
    { product_id: 5, descriptions_types_product_id: 8, content: "Weight 1 oz" },
    {
      product_id: 5,
      descriptions_types_product_id: 8,
      content: "Dimensions: 3.5 x 4.63 x 1 in",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 8,
      content: "Size: .5mm, 1 mm",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content: "Remove the applicator from the packaging.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content:
        "Sanitize the top pf applicator about 10 minutes with 70% Isopropyl Alcohol.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content: "Wash your face keep clean and dry.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content:
        "Place serum in infuser bottle. Do not use thick serums, consistency should be like to olive oil.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content: "Not for use with prescription products.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content:
        "Shake the Hydra Roller several about 2-3 times from side to side.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content: "Do not use roller on lips. Eyelids or mucus membranes.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content:
        "Use gently at first until you know what your skin can tolerate.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content: "The treatment should not be painful and should not draw blood.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content:
        "Use every 2-3 days until your skin becomes accustomed, then use no more than once a day.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content:
        "Be sure the device is vertical for serum to come out evenly when rolling.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content:
        "IF you have serum left on the skin after treatment, rub serum into the skin.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content: "Please see our information and instructional video",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 9,
      content: "Roll 4 time in each direction.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content: "Keep out of the reach of children.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content: "Never share the roller with other people.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content: "Keep the applicator always clean.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content:
        "Do not use on sunburn, open cuts, herpes, pustule acne lesions or any other sore areas, inflamed or infected skin.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content:
        "Do not use if you have a history of poor wound healing, skin disease, blood problems, are immunocompromised, are pregnant or lactating, are prone to keloid scarring or have diabetes.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content:
        "IF you are uncertain about your skin condition, please consult a dermatologist before using.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content:
        "Use of roller on open wounds may cause infection. If you develop any skin sensitivity after use, consult your physician.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content:
        "Your skin may redden after use this should go away within a few hours.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content:
        "You may experience some drying of the skin after use and/ or some flaking. If this happens, stop using the roller until the skin returns to normal.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content:
        "In some individuals, slight bleeding may occur, if this could happen, clean the are with warm soapy water, apply antiseptic ointment and allow area to heal before continuing use.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content:
        "Aspirin, Ibuprofen, vitamin E, other supplements and blood thinning drugs can cause increased bruising, please consult your physician if you are taking these medications.",
    },
    {
      product_id: 5,
      descriptions_types_product_id: 10,
      content:
        "Use entirely at your own risk. To the maximum extent permitted by law, we are not responsible for negative or damaging results obtained by proper or improper use of this product. Even though many of our customers have experienced incredibly positive results, we cannot guarantee results.",
    },
  ];

  for (let i = 0; i < relations.length; i++) {
    const message = SqlBuilder.getQueryInsertTable(
      "relations_descriptions_products",
      relations[i]
    );
    result.push({
      sql: message,
      name: message,
    });
  }

  return result;
};

module.exports = { getDescriptionsProductsRelations, getDescriptionsProducts };
