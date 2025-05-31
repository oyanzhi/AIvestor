# AIvestor

### Currently Undeployed

### NUS Orbital

Team AIvestor #7254\
Ong Yan Zhi & Aloysius Pek

## Index
- [Features](#features)
- [Motivations](#motivations)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Development](#development)

## Features
- **Core**
  - [ ] AI Stock Analysis
  - [ ] Personalised Investment Insights
  - [ ] Risk Assessment Dashboard
- **Extended**
  - [ ] User Profile Setup
  - [ ] Social Integration (Forum)
  - [ ] Real-Time Alerts
  - [ ] Admin Dashboard
  - [ ] Data Export
  - [ ] Double Authentication

## Motivations
Retail investors often lack access to advanced financial analysis tools due to their complexity, high cost and fear of making mistakes. AIvestor aims to bridge this gap through offering an AI-powered financial advisory system that provides real-time stock analysis, investment recommendations, and risk assessment in an easy-to-use platform.  

## Tech Stack
- NodeJS
- React
- Django
- PostgreSQL

## Setup
1. Ensure NodeJS, PostgreSQL, Python installed
    - [NodeJS](https://nodejs.org/en)
    - [PostgreSQL](https://www.postgresql.org/)
    - [Python](https://www.python.org/)

2. Clone Repository - `git clone git@github.com:oyanzhi/AIvestor.git`

3. On Powershell - `Set-ExecutionPolicy -ExecutionPolicy Unrestricted`

4. Install Dependencies
    - `npm install npm-run-all --save-dev`
    - `py -m pip install --upgrade pip`
    - `py -m pip install Django`
    - `py -m pip install djangorestframework`
    - `py -m pip install django-cors-headers`
    - `py -m pip install psycopg2`

5. `cd` to the [backend/clientaccount](/src/backend/clientaccount) directory 
    - py manage.py makemigrations
    - py manage.py migrate

6. Ensure that Local PostgreSQL has the following settings as in [Django Account Management Project](/src/backend/clientaccount/accountmanagementproject/)
    - Database Name: orbital25account
    - User: postgres
    - Password: default
    - Host: localhost
    - Port: 5432

## Development
Run `npm start-all` which starts both the frontend and backend servers\
**Frontend running on `localhost:3000`**\
**Backend running on `localhost:8000`**


