const Pg = require("../models/PgModel");

// ➕ CREATE
exports.createPg = async (req, res) => {
  try {
    const pg = new Pg(req.body);
    await pg.save();
    res.status(201).json(pg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 GET ALL
exports.getPg = async (req, res) => {
  try {
    const pgs = await Pg.find();
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ UPDATE
exports.updatePg = async (req, res) => {
  try {
    const updated = await Pg.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ DELETE
exports.deletePg = async (req, res) => {
  try {
    await Pg.findByIdAndDelete(req.params.id);
    res.json({ message: "PG Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 SEARCH + FILTER (MAIN LOGIC)
exports.searchPg = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, sharing, facilities } = req.query;

    let query = {};

    // 🔎 Search (name + location)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 🛏️ Sharing filter
    if (sharing) {
      query.sharing = sharing;
    }

    // 🏠 Facilities filter
    if (facilities) {
      query.facilities = { $in: facilities.split(",") };
    }

    const pgs = await Pg.find(query);
    res.json(pgs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};