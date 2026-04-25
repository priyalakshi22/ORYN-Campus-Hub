# 🎓 Oryn — CINEC Campus Hub

**Oryn** is an all-in-one campus life platform built for CINEC students. It brings together every essential campus service — from events and clubs to the café, gym, transit, library, and marketplace — under a single, beautifully designed web interface powered by a Node.js/Express REST API and a MySQL database.

---

## ✨ Features

| Module | Description |
|---|---|
| 🔐 **Auth** | Secure registration & login with JWT authentication and bcrypt password hashing |
| 📅 **Events** | Browse, register for, and track campus events |
| 🏛️ **Clubs** | Discover and join student clubs (IEEE, AIESEC, LEO, and more) |
| 🏆 **Rewards** | Earn and redeem loyalty points across all campus services |
| 🏋️ **Gym / Fitness** | View fitness classes and manage gym bookings |
| 📚 **Library** | Explore and borrow books from the campus library |
| ☕ **Café** | Browse the campus café menu, pre-order, and earn reward points |
| 🚌 **Transit** | Live bus tracking and route info for campus shuttles |
| 🏢 **Facilities** | Book campus rooms, labs, and spaces |
| 💼 **Careers** | Browse internship and job listings |
| 🛒 **Marketplace** | Buy and sell items within the campus community |
| 💬 **Social Feedback** | Submit and read reviews for campus services |

---

## 🛠️ Tech Stack

**Frontend**
- Vanilla HTML, CSS, JavaScript
- Google Fonts (Plus Jakarta Sans, Fraunces, Cormorant Garamond)

**Backend**
- [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- [MySQL 2](https://github.com/sidorares/node-mysql2) — relational database
- [JWT](https://github.com/auth0/node-jsonwebtoken) — token-based authentication
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — password hashing
- [Stripe](https://stripe.com/docs/api) — payment processing
- [Multer](https://github.com/expressjs/multer) — file/image uploads
- [dotenv](https://github.com/motdotla/dotenv) — environment configuration
- [CORS](https://github.com/expressjs/cors) — cross-origin resource sharing

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/oryn.git
cd oryn

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials, JWT secret, and Stripe key

# 4. Import the database schema
mysql -u root -p < schema.sql

# 5. Start the server
node Backend/Server.js
```

The server runs on `http://localhost:5500` by default.

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a new student |
| POST | `/api/login` | Login and receive a JWT |
| GET | `/api/events` | List all campus events |
| POST | `/api/events/register` | Register for an event |
| GET | `/api/clubs` | List all student clubs |
| GET | `/api/rewards/:user_id` | Get a user's reward points |
| POST | `/api/rewards/redeem` | Redeem points for a reward |
| GET | `/api/cafe` | Browse café menu |
| GET | `/api/transit` | Get bus routes and status |
| GET | `/api/gym` | View fitness classes |
| GET | `/api/jobs` | Browse job/internship listings |
| GET | `/api/marketplace` | Browse marketplace listings |
| GET | `/api/test` | Health check |

---

## 📁 Project Structure

```
oryn/
├── Backend/
│   ├── Server.js         # Express app entry point
│   ├── Db.js             # MySQL connection
│   ├── Auth.js           # Register / Login routes
│   ├── Users.js          # User profile routes
│   ├── Events.js         # Events routes
│   ├── Clubs.js          # Clubs routes
│   ├── Rewards.js        # Rewards & loyalty routes
│   ├── Cafe.js           # Café menu routes
│   ├── Transit.js        # Bus tracking routes
│   ├── Gym.js            # Fitness class routes
│   ├── Facilities.js     # Room booking routes
│   ├── Jobs.js           # Career listing routes
│   ├── Libarary.js       # Library routes
│   └── Marketplace.js    # Marketplace routes
├── index.html            # Sign-in page
├── home.html             # Dashboard
├── Events.html           # Events page
├── clubs.html            # Clubs page
├── REWARD.html           # Rewards page
├── Cafe.html             # Café page
├── transit.html          # Transit tracker
├── fitness.html          # Gym & fitness
├── careers.html          # Careers page
├── Booking.html          # Facility booking
├── About.html            # About page
├── Register.html         # Student registration
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5500
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=oryn_db
JWT_SECRET=your_super_secret_key
STRIPE_SECRET_KEY=sk_test_...
```

---



## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[ISC](LICENSE)

---

> Built with 💙 for ORYN students
