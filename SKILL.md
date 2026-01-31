---
name: lettabot
description: Set up and run LettaBot - a multi-channel AI assistant for Telegram, Slack, Discord, WhatsApp, and Signal. Supports both interactive wizard and non-interactive (agent-friendly) configuration.
---

# LettaBot Setup

Multi-channel AI assistant with persistent memory across Telegram, Slack, Discord, WhatsApp, and Signal.

## Quick Setup (Agent-Friendly)

For non-interactive setup (ideal for coding agents):

```bash
# 1. Clone and install
git clone https://github.com/letta-ai/lettabot.git
cd lettabot
npm install
npm run build
npm link

# 2. Configure via environment variables
export LETTA_API_KEY="letta_..."        # From app.letta.com
export LETTA_BASE_URL="https://api.letta.com"  # Or self-hosted
export LETTA_AGENT_ID="agent-..."       # Optional: use existing agent

# 3. Configure channel (example: Telegram)
export TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."  # From @BotFather
export TELEGRAM_DM_POLICY="pairing"     # Optional: pairing | allowlist | open

# 4. Run non-interactive setup
lettabot onboard --non-interactive

# 5. Start the bot
lettabot server
```

## Interactive Setup

For human-friendly setup with wizard:

```bash
lettabot onboard
```

The wizard will guide you through:
- Letta API authentication (OAuth or API key)
- Agent selection/creation
- Channel configuration (Telegram, Slack, Discord, WhatsApp, Signal)

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `LETTA_API_KEY` | API key from app.letta.com (or skip for OAuth) |
| `LETTA_BASE_URL` | API endpoint (default: https://api.letta.com) |

### Agent Selection

| Variable | Description |
|----------|-------------|
| `LETTA_AGENT_ID` | Use existing agent (skip agent creation) |
| `LETTA_AGENT_NAME` | Name for new agent (default: "lettabot") |
| `LETTA_MODEL` | Model for new agent (default: "claude-sonnet-4") |

### Telegram

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | ✅ |
| `TELEGRAM_DM_POLICY` | Access control: `pairing` \| `allowlist` \| `open` | ❌ (default: pairing) |
| `TELEGRAM_ALLOWED_USERS` | Comma-separated user IDs (if dmPolicy=allowlist) | ❌ |

### Slack (Socket Mode)

| Variable | Description | Required |
|----------|-------------|----------|
| `SLACK_BOT_TOKEN` | Bot User OAuth Token (xoxb-...) | ✅ |
| `SLACK_APP_TOKEN` | App-Level Token (xapp-...) for Socket Mode | ✅ |
| `SLACK_APP_NAME` | Custom app name (default: LETTA_AGENT_NAME or "LettaBot") | ❌ |
| `SLACK_DM_POLICY` | Access control: `pairing` \| `allowlist` \| `open` | ❌ (default: pairing) |
| `SLACK_ALLOWED_USERS` | Comma-separated Slack user IDs (if dmPolicy=allowlist) | ❌ |

**Setup Slack app:** See [Slack Setup Wizard](./src/setup/slack-wizard.ts) or run `lettabot onboard` for guided setup.

### Discord

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_BOT_TOKEN` | Bot token from discord.com/developers/applications | ✅ |
| `DISCORD_DM_POLICY` | Access control: `pairing` \| `allowlist` \| `open` | ❌ (default: pairing) |
| `DISCORD_ALLOWED_USERS` | Comma-separated Discord user IDs (if dmPolicy=allowlist) | ❌ |

**Setup Discord bot:** See [docs/discord-setup.md](./docs/discord-setup.md)

### WhatsApp

| Variable | Description | Required |
|----------|-------------|----------|
| `WHATSAPP_ENABLED` | Enable WhatsApp: `true` \| `false` | ✅ Must be explicit |
| `WHATSAPP_SELF_CHAT` | Self-chat mode: `true` (personal number) \| `false` (dedicated bot number) | ✅ Must be explicit |
| `WHATSAPP_DM_POLICY` | Access control: `pairing` \| `allowlist` \| `open` | ❌ (default: pairing) |
| `WHATSAPP_ALLOWED_USERS` | Comma-separated phone numbers with + (if dmPolicy=allowlist) | ❌ |

**Important:** 
- `WHATSAPP_SELF_CHAT=false` (dedicated bot number): Responds to ALL incoming messages
- `WHATSAPP_SELF_CHAT=true` (personal number): Only responds to "Message Yourself" chat
- QR code appears on first run - scan with WhatsApp app

### Signal

| Variable | Description | Required |
|----------|-------------|----------|
| `SIGNAL_PHONE_NUMBER` | Your phone number (with +) | ✅ |
| `SIGNAL_DM_POLICY` | Access control: `pairing` \| `allowlist` \| `open` | ❌ (default: pairing) |
| `SIGNAL_ALLOWED_USERS` | Comma-separated phone numbers with + (if dmPolicy=allowlist) | ❌ |

**Setup:** Requires Signal CLI - see [signal-cli documentation](https://github.com/AsamK/signal-cli).

## Channel-Specific Setup

### Telegram Bot Setup

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow prompts
3. Copy the token (format: `123456:ABC-DEF...`)
4. Set `TELEGRAM_BOT_TOKEN` environment variable

### Slack App Setup (Interactive)

For Socket Mode (required for real-time messages):

```bash
lettabot onboard
# Select "Slack" → "Guided setup"
```

This uses a manifest to pre-configure:
- Socket Mode
- 5 bot scopes (app_mentions:read, chat:write, im:*)
- 2 event subscriptions (app_mention, message.im)

### Slack App Setup (Manual)

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create app from manifest (see `src/setup/slack-wizard.ts` for manifest YAML)
3. Install to workspace → copy Bot Token (`xoxb-...`)
4. Enable Socket Mode → generate App Token (`xapp-...`)
5. Set both tokens in environment

## Access Control

Each channel supports three DM policies:

- **`pairing`** (recommended): Users get a code, you approve via `lettabot pairing approve <channel> <code>`
- **`allowlist`**: Only specified user IDs can message
- **`open`**: Anyone can message (not recommended)

## Configuration File

After onboarding, config is saved to `~/.config/lettabot/config.yaml`:

```yaml
server:
  baseUrl: https://api.letta.com
  apiKey: letta_...
  agentId: agent-...

telegram:
  enabled: true
  botToken: 123456:ABC-DEF...
  dmPolicy: pairing
  
slack:
  enabled: true
  botToken: xoxb-...
  appToken: xapp-...
  dmPolicy: pairing
```

Edit this file directly or re-run `lettabot onboard` to reconfigure.

## Commands

```bash
# Setup
lettabot onboard                    # Interactive wizard
lettabot onboard --non-interactive  # Env-based setup (agent-friendly)

# Run
lettabot server                     # Start bot server

# Manage
lettabot pairing list               # List pending pairing requests
lettabot pairing approve <channel> <code>  # Approve user
lettabot skills                     # Enable/disable skills

# Scheduling
lettabot cron list                  # List scheduled tasks
lettabot cron add "Daily standup at 9am" "0 9 * * *"  # Add cron job
```

## Troubleshooting

### "Module not found" errors

Make sure you've run `npm run build` after installing or pulling updates.

### Telegram bot not responding

1. Check token is correct: `curl https://api.telegram.org/bot<TOKEN>/getMe`
2. Ensure bot is started: `lettabot server` should show "Connected to Telegram"
3. Check access control: User may need pairing approval

### Slack not receiving messages

1. Verify Socket Mode is enabled in Slack app settings
2. Check both tokens are set: `SLACK_BOT_TOKEN` and `SLACK_APP_TOKEN`
3. Ensure event subscriptions are configured (app_mention, message.im)

### WhatsApp QR code not appearing

1. Make sure Signal Desktop is closed (conflicts with baileys)
2. Delete `~/.wwebjs_auth` if previously used different library
3. Check no other WhatsApp Web sessions are active

## Example: Agent Setup Flow

For coding agents helping users set up LettaBot:

```bash
# 1. Clone and build
git clone https://github.com/letta-ai/lettabot.git
cd lettabot
npm install && npm run build && npm link

# 2. Get Letta API key
# Guide user to app.letta.com → API Keys → Create Key

# 3. Get Telegram bot token
# Guide user to @BotFather → /newbot → follow prompts

# 4. Set environment variables
export LETTA_API_KEY="letta_..."
export TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."

# 5. Run non-interactive setup
lettabot onboard --non-interactive

# 6. Start server
lettabot server
```

The agent can verify success by checking:
- `lettabot server` output shows "Connected to Telegram"
- Config file exists at `~/.config/lettabot/config.yaml`
- User can message bot on Telegram

## Self-Hosted Letta

To use a self-hosted Letta server:

```bash
# Run Letta Docker
docker run -v ~/.letta/.persist/pgdata:/var/lib/postgresql/data \
  -p 8283:8283 \
  -e OPENAI_API_KEY="your_openai_api_key" \
  letta/letta:latest

# Configure LettaBot
export LETTA_BASE_URL="http://localhost:8283"
export LETTA_API_KEY="sk-..."  # From Letta admin panel

lettabot onboard --non-interactive
```

## Skills Integration

LettaBot supports loading skills from:
- **Clawdhub** ([clawdhub.com](https://clawdhub.com))
- **skills.sh** repositories
- Local `.skills/` directory

```bash
# Install skill from Clawdhub
npx molthub@latest install sonoscli

# Connect to LettaBot
lettabot skills
# Space to toggle, Enter to confirm

# Skills will be available to agent
```
