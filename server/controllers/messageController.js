import Chat from "../models/chat.js";
import User from "../models/user.js";
import axios from "axios";
import openai from "../config/openai.js";
import imagekit from "../config/imageKit.js";

// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.message.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timeStamp: Date.now(),
      isImage: false,
    };
    res.json({ success: true, reply });

    chat.message.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API Controller for Image Generation

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // Push user message
    chat.message.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
      isPublished
    });

    // Encode prompt
    const encodedPrompt = encodeURIComponent(prompt);

    // Construct ImageKit AI generation URL
    const generatedImageUrl = `${process.env.IMAGEKIT_URL}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    // Trigger generation by fetching from ImageKit
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // Convert to base64 (fix: correct MIME type)
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    // Upload to ImageKit Media Library
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timeStamp: Date.now(),
      isImage: true,
      isPublished,
    };

    // Send reply immediately
    res.json({ success: true, reply });

    // Save chat + reduce credits
    chat.message.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    console.error("Image generation error:", error);
    res.json({ success: false, message: error.message });
  }
};


