# 🎨 StructViz: Interactive Data Structure Visualizer

StructViz is an interactive, animated educational tool designed to help students and developers visualize how common data structures work under the hood.

Built with **React** and **Tailwind CSS**, and powered by **Google's Gemini AI**, it offers real-time visualization of insertion, deletion, and traversal operations.

---

## 🚀 View the Live Application
*(https://timothi07.github.io/my-viz-app/)*

---

## ✨ Features

### 🧠 Supported Data Structures

- **Stack:** Visualize LIFO (Last-In, First-Out) operations with Push/Pop animations.  
- **Queue:** Visualize FIFO (First-In, First-Out) operations with Enqueue/Dequeue.  
- **Singly Linked List:** Interactive node creation and pointer manipulation.  
- **Binary Search Tree (BST):** Auto-balancing visual layout with step-by-step traversal animations.  
- **Min Heap:** Visualize binary heap properties with “Bubble Up” and “Heapify Down” animations.  
- **Hash Table:** Demonstrate collision resolution using chaining.  
- **Graph:** Interactive graph builder (add nodes and edges dynamically).  

---

## 🤖 AI Tutor (Powered by Gemini)

This app integrates the **Gemini API** to act as a personal tutor:

- **Explain State:** The AI analyzes the current visual state of your data structure and explains it in plain English.  
- **Code Generation:** Get Python or JavaScript implementation code for the structure you are viewing.  
- **Quiz Mode:** The AI generates a unique multiple-choice question based on the specific data currently on your screen.  

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)  
- **Styling:** Tailwind CSS  
- **Icons:** Lucide React  
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`)  
- **Deployment:** GitHub Pages  

---

## 🏃‍♂️ Running Locally

Follow these steps to run the project on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/timothi07/my-viz-app.git
cd my-viz-app