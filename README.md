# Dhab - Decentralized Anonymous Recovery App

<div align="center">
  <img src="https://i.imgur.com/brcnijg.png" alt="Dhab Logo" width="200"/>
  
  **A Farcaster MiniApp for anonymous addiction recovery support**

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
  [![Powered by Farcaster](https://img.shields.io/badge/Powered%20by-Farcaster-purple)](https://www.farcaster.xyz/)
</div>

---

## 📖 Overview

Dhab (derived from the Arabic word for "gold" - ذهب) is a decentralized, anonymous recovery application built as a Farcaster MiniApp. It provides individuals struggling with addiction a safe, supportive, and privacy-focused platform to track their sobriety journey, connect with a community, and celebrate their progress.

### Why Dhab?

- **Privacy First**: Anonymous community interactions with pseudonymous identifiers
- **Decentralized**: Built on Web3 principles with optional wallet integration
- **Comprehensive**: Tracks 195+ types of addictions across 13 categories
- **Real-time**: Live sobriety timer with detailed progress metrics
- **Community-Driven**: Safe space for sharing experiences and support
- **Financial Insights**: Calculate money saved by staying sober

---

## ✨ Features

### 🎯 Core Features

- **Sobriety Tracking**
  - Real-time countdown timer (days, hours, minutes, seconds)
  - Customizable start date and time
  - Support for 195+ addiction types across 13 categories
  - Custom addiction input option

- **Progress Dashboard**
  - Total sober time with detailed breakdown
  - Money saved calculator based on daily cost
  - Milestone achievements
  - Visual progress indicators

- **Anonymous Community**
  - Pseudonymous posting with generated identifiers
  - Emoji reactions on posts
  - Comment threads for support
  - Content flagging and moderation
  - Milestone celebration badges

- **Data Persistence**
  - Local storage for offline capability
  - Database synchronization via Vercel Postgres
  - Cross-device sync with Farcaster ID

### 🔐 Privacy & Security

- **Anonymous Identity**: Users interact with generated pseudonyms (e.g., "BravePhoenix42")
- **No Personal Data**: Only Farcaster ID (FID) is stored
- **Content Moderation**: Community-driven flagging system
- **Optional Web3**: Wallet connection is completely optional

### 🌐 Web3 Integration

- **Multiple Auth Methods**:
  - Farcaster OAuth
  - Google OAuth
  - Email verification
  
- **Wallet Support**:
  - Thirdweb in-app wallets
  - Base and Optimism chains
  - Optional wallet linking for enhanced features

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI primitives

### Backend & Data
- **Database**: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- **ORM**: Direct SQL with `@vercel/postgres`
- **Storage**: LocalStorage for offline-first approach

### Web3 & Authentication
- **Farcaster**: MiniKit SDK for MiniApp integration
- **Wallets**: Thirdweb SDK for wallet connections
- **Chains**: Base, Optimism (via Wagmi)
- **Auth**: Farcaster Quick Auth, OAuth providers

### Deployment
- **Platform**: Vercel
- **CDN**: Vercel Edge Network
- **Environment**: Node.js

---

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Farcaster authentication
│   │   │   ├── community/    # Community posts & interactions
│   │   │   └── sobriety/     # User sobriety data CRUD
│   │   ├── app.tsx           # Main app component
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── providers.tsx     # Context providers
│   │
│   ├── components/            # React components
│   │   ├── sober-timer/      # Main feature components
│   │   │   ├── CommunityView.tsx  # Community forum
│   │   │   ├── PledgeView.tsx     # Initial pledge screen
│   │   │   ├── SetupView.tsx      # Addiction setup
│   │   │   └── TimerView.tsx      # Main timer display
│   │   ├── providers/        # Context providers
│   │   ├── ui/               # Reusable UI components
│   │   └── SoberTimer.tsx    # Main orchestrator component
│   │
│   ├── hooks/                 # Custom React hooks
│   │   └── useThirdwebAuth.ts # Web3 authentication hook
│   │
│   └── lib/                   # Utility libraries
│       ├── addictions.ts     # Addiction categories & search
│       ├── community.ts      # Community utilities
│       ├── db.ts             # Database operations
│       ├── thirdweb.ts       # Web3 client config
│       ├── truncateAddress.ts # Address formatting
│       └── utils.ts          # General utilities
│
├── public/                    # Static assets
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Vercel account (for database and deployment)
- Thirdweb account (for Web3 features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ivcained/The-Golden-Mean.git
   cd The-Golden-Mean
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # App Configuration
   NEXT_PUBLIC_URL=http://localhost:3000

   # Thirdweb (Web3 Authentication)
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

   # Vercel Postgres (Database)
   POSTGRES_URL=your_postgres_connection_string
   POSTGRES_PRISMA_URL=your_postgres_prisma_url
   POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
   POSTGRES_USER=your_postgres_user
   POSTGRES_HOST=your_postgres_host
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DATABASE=your_postgres_database
   ```

4. **Initialize the database**

   The database tables will be automatically created on first API request. You can also manually create them by accessing:
   - `/api/sobriety` (creates user_sobriety table)
   - `/api/community` (creates community tables)

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Testing with Farcaster

To test as a Farcaster MiniApp:

1. **Use a tunneling service** (e.g., [ngrok](https://ngrok.com/))
   ```bash
   ngrok http 3000
   ```

2. **Test in Farcaster playground**
   - Visit the [Farcaster MiniApps playground](https://miniapps.farcaster.xyz)
   - Enter your ngrok URL
   - Test the app in a simulated MiniApp environment

3. **Test in Base App**
   - Use your ngrok URL in Base App's MiniApp browser
   - Full Farcaster context will be available

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_URL` | Public URL of your app | Yes |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | Thirdweb client ID for Web3 | Yes |
| `POSTGRES_URL` | Vercel Postgres connection string | Yes |
| `POSTGRES_PRISMA_URL` | Prisma-compatible connection string | Yes |
| `POSTGRES_URL_NON_POOLING` | Non-pooling connection string | Yes |
| `POSTGRES_USER` | Database user | Yes |
| `POSTGRES_HOST` | Database host | Yes |
| `POSTGRES_PASSWORD` | Database password | Yes |
| `POSTGRES_DATABASE` | Database name | Yes |

### Getting API Keys

**Thirdweb Client ID**:
1. Visit [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
2. Create a new project
3. Copy your Client ID

**Vercel Postgres**:
1. Create a Vercel project
2. Add a Postgres database from the Storage tab
3. Copy the connection strings from the `.env.local` tab

---

## 💾 Database Schema

### user_sobriety
Stores user sobriety tracking data.

```sql
CREATE TABLE user_sobriety (
  fid INTEGER PRIMARY KEY,
  start_date VARCHAR(10) NOT NULL,
  start_time VARCHAR(5),
  addiction VARCHAR(255) NOT NULL,
  custom_addiction VARCHAR(255),
  daily_cost DECIMAL(10, 2) DEFAULT 8.00,
  motivation TEXT,
  pledge_date VARCHAR(10),
  wallet_address VARCHAR(42),
  auth_strategy VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### community_posts
Stores community posts.

```sql
CREATE TABLE community_posts (
  id VARCHAR(50) PRIMARY KEY,
  anonymous_id VARCHAR(100) NOT NULL,
  addiction VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  milestone VARCHAR(100),
  timestamp BIGINT NOT NULL,
  flag_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### community_comments
Stores comments on posts.

```sql
CREATE TABLE community_comments (
  id VARCHAR(50) PRIMARY KEY,
  post_id VARCHAR(50) NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  anonymous_id VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  flag_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### community_reactions
Stores emoji reactions.

```sql
CREATE TABLE community_reactions (
  id VARCHAR(100) PRIMARY KEY,
  post_id VARCHAR(50) NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  anonymous_id VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, anonymous_id, emoji)
);
```

### community_flags
Tracks content moderation flags.

```sql
CREATE TABLE community_flags (
  id VARCHAR(100) PRIMARY KEY,
  target_type VARCHAR(10) NOT NULL,
  target_id VARCHAR(50) NOT NULL,
  anonymous_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(target_type, target_id, anonymous_id)
);
```

---

## 🔌 API Documentation

### Authentication API

#### `GET /api/auth`
Verifies Farcaster Quick Auth JWT token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "fid": 12345,
    "issuedAt": 1234567890,
    "expiresAt": 1234567890
  }
}
```

### Sobriety Data API

#### `GET /api/sobriety?fid={fid}`
Fetch user sobriety data.

**Response:**
```json
{
  "data": {
    "fid": 12345,
    "startDate": "2024-01-01",
    "startTime": "00:00",
    "addiction": "Alcohol",
    "dailyCost": 15.00,
    "motivation": "For my family"
  }
}
```

#### `POST /api/sobriety`
Create or update sobriety data.

**Body:**
```json
{
  "fid": 12345,
  "startDate": "2024-01-01",
  "startTime": "00:00",
  "addiction": "Alcohol",
  "dailyCost": 15.00,
  "motivation": "For my family"
}
```

#### `DELETE /api/sobriety?fid={fid}`
Delete user sobriety data.

### Community API

#### `GET /api/community?addiction={addiction}`
Fetch posts for an addiction category.

**Response:**
```json
{
  "posts": [
    {
      "id": "post_123",
      "anonymousId": "BravePhoenix42",
      "content": "30 days sober today!",
      "timestamp": 1234567890000,
      "reactions": [],
      "comments": []
    }
  ]
}
```

#### `POST /api/community`
Perform community actions (create post, comment, react, flag).

**Body (create post):**
```json
{
  "action": "create_post",
  "id": "post_123",
  "anonymousId": "BravePhoenix42",
  "addiction": "Alcohol",
  "content": "Celebrating my first week!",
  "timestamp": 1234567890000
}
```

**Body (toggle reaction):**
```json
{
  "action": "toggle_reaction",
  "postId": "post_123",
  "anonymousId": "StrongLion88",
  "emoji": "👏"
}
```

---

## 🎨 Addiction Categories

Dhab supports 195+ addictions across 13 categories:

1. **Benzodiazepines** (12 types)
2. **Alcoholic Drinks** (11 types)
3. **Nicotine and Tobacco** (7 types)
4. **Cannabis Products** (5 types)
5. **Stimulants** (16 types)
6. **Other Drugs** (21 types)
7. **Food and Caffeine** (13 types)
8. **Eating Disorders** (8 types)
9. **Sexual Behaviours** (4 types)
10. **Body Focused Behaviours** (8 types)
11. **Impulsive Behaviours** (6 types)
12. **Social Behaviours** (8 types)
13. **Technology** (11 types)

See `src/lib/addictions.ts` for the complete list.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Ensure all linting passes: `npm run lint`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Farcaster** for the MiniKit SDK and decentralized social platform
- **Base** for blockchain infrastructure
- **Thirdweb** for Web3 authentication tools
- **Vercel** for hosting and database services
- **Recovery Communities** for inspiration and support

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ivcained/The-Golden-Mean/issues)
- **Farcaster**: [@ivcained](https://farcaster.com/ivc)
- **Documentation**: [Farcaster MiniKit Docs](https://docs.base.org/base-app/build-with-minikit/overview)

---

## 🌟 Roadmap

- [ ] Native mobile app
- [ ] Multi-language support
- [ ] AI-powered recovery insights
- [ ] Sponsor/accountability partner system
- [ ] NFT milestone badges
- [ ] Integration with recovery organizations
- [ ] Streak challenges and gamification
- [ ] Anonymous video/audio support groups

---

<div align="center">
  <strong>Building a supportive, private, and empowering recovery platform for everyone.</strong>
  
  Made with ❤️ by the Dhab Team
</div>
