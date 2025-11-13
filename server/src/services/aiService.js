import axios from "axios";

export const regenerateEmail = async (req, res) => {
  try {
    const { mpName, topic, userName } = req.body;

    const modelId = "gpt2"; // ya koi free testing model
    const url = `https://router.huggingface.co/hf-inference/v1/models//${modelId}`;

    const response = await axios.post(url, {
      inputs: `Write a polite email to ${mpName} about ${topic} from ${userName}.`
    }, {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    res.json({ success: true, message: response.data });
  } catch (error) {
    console.error("❌ /api/regenerate error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};
