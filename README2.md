# EcoTrack
An IoT-enabled carbon footprint monitoring system with AI-driven analytics and hardware verification.

––––––––––––––––––––
## Problem Statement
Current carbon tracking relies on manual estimation, which is error-prone, unverifiable, and lacks real-time granularity.
Without accurate, real-time data, individuals and organizations cannot effectively identify high-emission sources or validate their reduction efforts, leading to ineffective sustainability strategies or "greenwashing."

––––––––––––––––––––
## Users & Context
- **Users**: Environmentally conscious Individuals, Communities, and Organizations (Admins/Employees).
- **Context**: Deployed in residential homes and office buildings to monitor appliance-level energy consumption. Organizations use it to track aggregate departmental emissions and verify corporate sustainability goals.

––––––––––––––––––––
## Solution Overview
EcoTrack is a full-stack ecosystem combining hardware sensors, a web dashboard, and AI analytics to automate carbon tracking.
It captures real-time power data, processes it for appliance recognition and forecasting, and provides actionable insights via a web interface and Telegram chatbot.

**Architecture Flow:**
![Architecture Diagram](docs/diagram.png)

### Key Screens
| Live Energy Dashboard | WhatsApp Chatbot Flow |
|:---:|:---:|
| ![Dashboard](./docs/dashboard_placeholder.png) | ![Chatbot](./docs/chatbot_placeholder.png) |

| Community Heatmap | Daily Engagement |
|:---:|:---:|
| ![Heatmap](./docs/heatmap_placeholder.png) | ![Badges](./docs/image.png) |

| Personalised Dashboard | Actionable Insights |
|:---:|:---:|
| ![Personalised Dashboard](./docs/personalised_dashboard_placeholder.png) | ![Insights](./docs/insights_placeholder.png) |

| Sustainability Challenges | Community Leaderboard |
|:---:|:---:|
| ![Challenges](./docs/challenges_placeholder.png) | ![Community](./docs/community_placeholder.png) |

––––––––––––––––––––
## Setup & Run

### Prerequisites
- Node.js (v16+) & npm
- Python 3.9+
- PostgreSQL
- Telegram Bot Token & Google Gemini API Key

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/EcoTrack.git
   cd EcoTrack
   ```

2. **Frontend Setup (Root Directory)**
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   # Set up .env with DB_URL, TELEGRAM_TOKEN, GEMINI_API_KEY
   python manage.py migrate
   python manage.py runserver
   ```

4. **Hardware (Optional)**
   - Flash the `firmware/` code to an ESP32 connected to ZMPT101B and SCT-013 sensors.

––––––––––––––––––––
## Models & Data

### Models Used
- **LSTM (Long Short-Term Memory)**: Forecasts future energy consumption based on historical time-series data.
- **Random Forest Regressor**: dynamically estimates emission factors based on grid load and time of day.
- **Google Gemini 2.5**: Processes natural language queries and analyzes images (e.g., bills) for data extraction.

### Data Sources
- **Primary Data**: Real-time voltage and current readings from physical IoT sensors (ZMPT101B, SCT-013).
- **User Data**: Activity logs and interactions provided voluntarily via the Web App or Telegram.
- **License**: [This project processes user-generated data. External datasets are null/void for this demo.]

––––––––––––––––––––
## Evaluation & Guardrails

- **Verification**: Gamification (XP/Badges) is strictly tied to hardware-verified reductions, preventing manual falsification.
- **AI Safety**: The Chatbot is scoped strictly to sustainability topics using prompt engineering guardrails.
- **Privacy**: Location data for heatmaps is aggregated and anonymized at the city/state level.

––––––––––––––––––––
## Known Limitations & Risks

- **Connectivity**: Real-time tracking requires a stable WiFi connection for the ESP32 module.
- **Calibration**: Sensors require initial calibration against a known load to ensure accuracy.
- **Region Specificity**: Emission factors are currently optimized for the Indian power grid.

––––––––––––––––––––
## Team
- **Aditya Sharma**: [Backend Developer] - [adishahil346@gmail.com]
- **Abhishek Bhangdiya**: [Frontend Developer] - [abhishekbhangdiya0@gmail.com]
