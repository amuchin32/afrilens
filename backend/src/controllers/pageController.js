const Page = require('../models/Page');

const DEFAULTS = {
  contact: {
    bannerTitle: "Contact AfriLENS",
    bannerDesc: "Have a news tip, story idea, press query or partnership proposal? We'd love to hear from you.",
    editorialEmail: "editorial@afrilens.com",
    adsEmail: "ads@afrilens.com",
    tipsEmail: "tips@afrilens.com",
    whatsapp: "+231 77 000 0000",
    address: "Monrovia, Liberia",
    twitterUrl: "#",
    facebookUrl: "#",
    instagramUrl: "#",
    linkedinUrl: "#",
    newsTipTitle: "Submit a News Tip",
    newsTipBody: "Have a story the world needs to hear? Send us your news tip securely and confidentially. We protect all sources.",
    formSuccessMsg: "Thanks for reaching out. Our team will get back to you within 24-48 hours.",
  },
  about: {
    heroTitle: "Africa's Lens on the World",
    heroLead: "AfriLENS is an independent digital news platform dedicated to telling Africa's stories with depth, accuracy and pride.",
    missionTitle: "Journalism that serves Africa",
    missionBody1: "Founded in 2020, AfriLENS was built on one conviction: African stories, told by Africans, for the world.",
    missionBody2: "From politics and business to culture, technology and opportunity, we cover the stories that shape daily life across 54 nations.",
    missionQuote: "We don't just report on Africa. We report from Africa.",
    stat1Value: "2M+",  stat1Label: "Monthly Readers",
    stat2Value: "50+",  stat2Label: "Countries Reached",
    stat3Value: "10K+", stat3Label: "Stories Published",
    stat4Value: "12",   stat4Label: "Awards Won",
    ctaTitle: "Join the AfriLENS community",
    ctaSubtitle: "Subscribe for free to get Africa's most important stories in your inbox every morning.",
  },
};

exports.getPage = async (req, res) => {
  try {
    const defaults = DEFAULTS[req.params.key] || {};
    let page = await Page.findOne({ key: req.params.key });
    const content = { ...defaults, ...(page?.content || {}) };
    res.json({ success: true, content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const defaults = DEFAULTS[req.params.key] || {};
    const merged = { ...defaults, ...req.body.content };
    const page = await Page.findOneAndUpdate(
      { key: req.params.key },
      { content: merged },
      { new: true, upsert: true, runValidators: false }
    );
    res.json({ success: true, content: page.content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
