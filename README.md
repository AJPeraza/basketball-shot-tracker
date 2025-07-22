# 🏀 Basketball Shot Tracker

A sleek, responsive basketball shot chart logger and skill tracker.  
Log shots on a virtual court, track performance, and export your data for review — all from your browser.

---

## 🔧 Features

- 🖱️ Click to log shots by (x, y) coordinate
- 📊 Real-time stats by shot zone
- 📱 Mobile-friendly design
- 🧠 AI-ready structure for future feedback and heatmap overlays
- 📤 Export logged shots as CSV

---

## 💻 Tech Stack

- **HTML5 + CSS3**
- **JavaScript (Vanilla)**
- **SVG-based court rendering via [`basketball-court`](https://www.npmjs.com/package/basketball-court)**

---

## 🗺️ Layout Logic

- Full SVG court is `1130px` tall
- `transform: translateY(-565px)` crops to the **bottom half** of the court (offensive half)
- Responsive styling ensures the layout works across screen sizes

---

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/AJPeraza/basketball-shot-tracker.git
   cd basketball-shot-tracker
