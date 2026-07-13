const {model} = require("mongoose");
const {HoldingsSchema} = require("../schemas/HoldiingsSchema");

const HoldingsModel = model("holding", HoldingsSchema);

module.exports = {HoldingsModel};

