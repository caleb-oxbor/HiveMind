# HiveMind
The world's greatest website for college students needing to share and collaborate on study material!

# Installation Instructions

1. Install Node.js (https://nodejs.org/en).
2. Create a Supabase account (https://supabase.com/) and ensure you are a collaborator on the HiveMind project.
3. Clone the repository or download the ZIP from this page.
4. Create a .env file in both the "client" folder and the "server" folder. Enter API keys for the supabase URL and supabase anon key into client, and both of those same keys in addition to the jwtSecret key in the server .env file. In total, 2 environment variables should be in client/.env and 3 should be in server/.env.
5. Navigate to the project in two separate instances of a terminal. Navigate to the "client" folder in one and "server" in the other.
6. Run "npm install" in both terminals.
7. Run "npm start" in both terminals.
