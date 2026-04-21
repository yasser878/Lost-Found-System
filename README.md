🕵️‍♂️ Lost & Found Community

# Overview
The Lost & Found Community is a web application that allows users to report lost items and find items within a community.  
Users can create posts for lost or found items, search and filter items, and track their posts.  
Admins can manage items, users, and view all activities.

# Setup

## Prerequisites
- Python 3.10+
- Node.js & npm
- Git

## Installation

### Clone the repository
git clone https://github.com/Amrnagy32/Lost-Found-community.git
cd lost-and-found

### Backend setup
cd backend
python -m venv venv
# Activate environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
python app.py

### Frontend setup
cd frontend
npm install
npm start

# Deployment
The application is deployed and accessible online:  
[Lost & Found Community Live Site](https://6956c7dd8870fd3cd4a4e9a3--lostfoundcommunity.netlify.app/)

# Workflow

## User Workflow
Sign Up / Login  
      ↓  
Create Lost/Found Post  
      ↓  
Edit/Delete Own Posts  
      ↓  
Search / Filter Items  

## Admin Workflow
Login  
      ↓  
Manage Items: Add / Update / Delete  
      ↓  
View All Posts & Activity

# Project Structure
lost-and-found/  
├── backend/  
│   ├── app.py  
│   ├── requirements.txt  
│   └── ...  
├── frontend/  
│   ├── index.html  
│   ├── main.js  
│   └── ...  
└── README.md
