# FTTH/FTTB Installation Wizard

A professional, web-based tool designed for field engineers and technicians to standardize the documentation of fiber-optic installations (Fiber-to-the-Home/Building). This utility is specifically tailored to meet the standards of the Nigerian ISP industry, providing a structured, step-by-step workflow to ensure all critical installation data, measurements, and evidence are captured on-site.

## 🚀 Key Features

### 1. Multi-Step Data Capture
The wizard breaks down complex installations into manageable segments:
- **Customer & Service Identity**: Contact info, service address, and subscription package details.
- **ODN (Outside Plant)**: OLT, PON port, splitters, and FAT (Fiber Access Terminal) records.
- **Optical Measurements**: Captures power levels (Tx/Rx) and automatically calculates end-to-end loss.
- **Equipment Tracking**: Inventory management for ONTs, routers, and UPS units (serial numbers & asset tags).
- **Physical Installation**: Pole condition, cable route description, and grounding status.
- **Testing & Verification**: Speed tests (DL/UL), latency (ping), and VoIP quality (MOS scores).

### 2. Media & Evidence
- **Photo Documentation**: Specialized slots for mandatory photos (building, pole, FAT, signal readings).
- **Route Map**: Support for uploading KML/KMZ or image files of the fiber route.
- **Digital Signatures**: Integrated signature pads for customer and engineer sign-off via Canvas API.

### 3. Automated Reporting
- **Full Installation Report**: Comprehensive internal technical record.
- **Customer Handover Certificate**: Professional proof of service for the client.
- **Maintenance Reference Card**: Baseline signal readings for future troubleshooting.

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML5 & JavaScript (No frameworks, high performance).
- **Styling**: Modern CSS with Inter and JetBrains Mono typography.
- **Persistence**: `localStorage` integration ensures progress is saved even if the browser closes.
- **APIs Used**: 
  - **Geolocation API**: Auto-capture GPS coordinates for poles and buildings.
  - **Media Capture API**: Direct camera access for photo evidence.
  - **Canvas API**: Digital signature capture.

## 📂 Project Structure

- `index.html`: The primary data entry wizard.
- `wizard-core.js`: Core logic for state management, validation, and calculations.
- `preview.html`: Live summary view for data verification.
- `pdf-report.html`: Print-optimized reporting engine for PDF generation.

## 📖 Usage

1. Open `index.html` in a modern web browser (mobile or desktop).
2. Complete each step of the wizard. Required fields must be filled to proceed to report generation.
3. Use the **Preview** page to review all data.
4. Go to **Generate Documentation** to print or save the final PDF reports.

---
*Standards: Nigerian ISP Installation Standard (FTTH/FTTB)*
