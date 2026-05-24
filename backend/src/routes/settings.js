const express = require("express");
const router  = express.Router();
const Setting = require("../models/Setting");

router.get("/social", async (req, res) => {
  try {
    const doc = await Setting.findOne({ key: "social_links" });
    res.json({ links: doc?.value || {} });
  } catch { res.status(500).json({ message: "Server error" }); }
});

router.put("/social", async (req, res) => {
  try {
    const { links } = req.body;
    await Setting.findOneAndUpdate(
      { key: "social_links" },
      { key: "social_links", value: links },
      { upsert: true, new: true }
    );
    res.json({ success: true, links });
  } catch { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
