import { getMPDetails } from "../services/mpService.js";

export const findMPByPostcode = async (req, res) => {
  try {
    const { postcode } = req.body;

    if (!postcode) {
      return res.status(400).json({ error: "Postcode is required" });
    }

    const data = await getMPDetails(postcode);

    if (!data) {
      return res.status(404).json({ error: "MP not found for this postcode" });
    }

    res.json({
      success: true,
      message: "MP details found",
      data,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
