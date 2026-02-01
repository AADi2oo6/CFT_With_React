––––––––––––––––––––
AI Impact Statement
––––––––––––––––––––

Tasks Automated / Augmented:
- **Automated:** Real-time carbon footprint calculation (IoT), energy usage forecasting, and text extraction from utility bills/images.
- **Augmented:** Appliance-level load disaggregation (NILM) to identify specific energy consumers.
- **Human Control:** Users retain decision-making authority over energy reduction actions and budget thresholds.

Model(s) Used & Rationale:
- **LSTM (Recurrent Neural Network):** Selected for accurate time-series forecasting of short-term energy demand relative to historical patterns.
- **Random Forest Regressor:** Used to estimate dynamic emission factors based on variable load signatures, outperforming static coefficients.
- **Google Gemini 2.5 Flash:** Utilized for efficient, low-latency extraction of structured data from unstructured user-uploaded images and documents.

Data Provenance & Governance:
- **Nature of Data:** Primary inputs are real-time, user-generated IoT sensor streams (Voltage/Current) and user-uploaded images. Model training utilizes ~15,000 data points for calibration.
- **Licensing / Consent:**
  [IoT Data: User-owned, private stream | Data: Internally generated for R&D]

Guardrails & Evaluation Plan:
- **Measures:** Hardware-layer verification (ESP32) ensures input integrity, preventing falsified manual entries.
- **Evaluation:** Model accuracy is evaluated against standard grid meter readings. System reliability is monitored via API response latency and sensor connectivity logs.

Expected User / Business / Safety Impact:
- **Impact:** Provides users with granular, verified visibility into private energy consumption, enabling measurable carbon footprint reduction (estimated 15-40%).
- **Safety:** identifying abnormal power usage patterns can serve as an early warning for potential electrical overloads.
