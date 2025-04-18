
const { Julep } = require('@julep/sdk');
const yaml = require('yaml');
const User = require('../models/User.model');
const History = require('../models/history.model.js');
require('dotenv').config();

const client = new Julep({ apiKey: process.env.JULIP_API_KEY });

let cachedAgentId = null;
let cachedTaskId = null;

async function initializeAgent() {
  if (cachedAgentId) return cachedAgentId;
  const agent = await client.agents.create({
    name: "AI Doctor",
    model: "gpt-4o",
    about: "A virtual doctor providing health and wellness advice.",
    instructions: "Maintain conversation history and give daily guidance based on previous input.",
    tone: "professional",
    personality: "friendly",
    style: "concise",
    temperature: 0.5,
    maxTokens: 1500
  });
  cachedAgentId = agent.id;
  return agent.id;
}

async function initializeTask(agentId) {
  if (cachedTaskId) return cachedTaskId;
  const taskDef = `
name: Health Assistant
description: Answer health-related questions and provide advice based on symptoms or wellness inquiries.
main:
  - prompt:
      - role: system
        content: "You are an AI doctor. Use the conversation history to provide personalized daily guidance."
      - role: user
        content: "{{ steps[0].input.prompt }}"
`;
  const task = await client.tasks.create(agentId, yaml.parse(taskDef));
  cachedTaskId = task.id;
  return task.id;
}

async function getOrCreateUser(userId) {
  const user = await client.users.create({
    name: `Patient ${userId}`,
    about: "A patient seeking medical advice",
    metadata: { userId }
  });
  return user.id;
}

function formatHistoryMessages(history) {
  return history
    .map(entry => {
      return entry.messages.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`).join('\n');
    })
    .join('\n') + '\nAI:';
}

async function askAiDoctor(req, res) {
  try {
    const { userId, question } = req.body;
    if (!userId || !question) {
      return res.status(400).json({ error: "userId and question are required" });
    }

    // Step 1: Find user
    const user = await User.findById(userId).populate("chatHistoryDetails");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: Find or create History document
    let historyDoc;
    if (!user.chatHistoryDetails) {
      historyDoc = new History({ user: userId, history: [] });
      await historyDoc.save();
      user.chatHistoryDetails = historyDoc._id;
      await user.save();
    } else {
      historyDoc = user.chatHistoryDetails;
    }

    // Step 3: Rotate history if more than 7 days
    if (historyDoc.history.length >= 7) {
      historyDoc.history.shift();
    }

    // Step 4: Check if today has an entry
    const todayDate = new Date().toISOString().split("T")[0];
    let todayEntry = historyDoc.history.find(h => h.label === todayDate);

    if (!todayEntry) {
      todayEntry = { label: todayDate, messages: [] };
      historyDoc.history.push(todayEntry);
    }

    // Step 5: Add user question to today’s entry
    todayEntry.messages.push({ role: "user", content: question });

    // Step 6: Build prompt from the entire history
    const promptText = formatHistoryMessages(historyDoc.history);

    // Step 7: Initialize AI agent and task
    const agentId = await initializeAgent();
    const taskId = await initializeTask(agentId);
    const julepUserId = await getOrCreateUser(userId);

    // Step 8: Get AI reply
    const exec = await client.executions.create(taskId, {
      input: { prompt: promptText },
      user_id: julepUserId
    });

    let result;
    do {
      result = await client.executions.get(exec.id);
      if (result.status === 'succeeded' || result.status === 'failed') break;
      await new Promise(r => setTimeout(r, 500));
    } while (true);

    if (result.status !== 'succeeded') {
      console.error("Execution failed:", result);
      return res.status(500).json({ error: "AI execution failed", details: result });
    }

    const reply = result.output?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(500).json({ error: "AI returned no reply" });
    }

    // Step 9: Store AI reply
    todayEntry.messages.push({ role: "ai", content: reply });
    await historyDoc.save();

    return res.json({ response: reply });
  } catch (err) {
    console.error("❌ AI Doctor Error:\n", err);
    return res.status(500).json({ error: "AI service error", details: err.message });
  }
}

module.exports = { askAiDoctor };