# HealthLocal 🏥

**Find and book local healthcare, instantly.**

HealthLocal is a comprehensive web application that helps users find local healthcare providers, book appointments, and navigate health programs. Built with React, it features real-time provider search, appointment booking, insurance verification, and integration with health data APIs.

## ✨ Features

### Core Features
- **🗺️ Geo-located Healthcare Provider Directory** - Searchable and filterable directory based on location, specialty, insurance, and reviews
- **🚨 Urgent Care & Emergency Services Finder** - Real-time mapping with wait times and capacity information
- **📅 Integrated Appointment Booking** - Streamlined booking, rescheduling, and cancellation system
- **🏛️ Local Health Program Navigator** - Information and guidance on public health programs and community initiatives

### Premium Features (Subscription)
- **🔍 Advanced Filtering** - Enhanced search capabilities with detailed filters
- **📋 Insurance Verification** - Real-time insurance coverage verification
- **⚡ Real-time Availability** - Live appointment slot availability
- **🔔 Appointment Reminders** - Automated reminder system
- **📞 Priority Support** - Enhanced customer support

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **State Management**: React Context API
- **Maps & Geolocation**: Google Maps API, Google Places API
- **Payments**: Stripe
- **Health Data**: OpenFDA API
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Google Maps API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-4905.git
   cd this-is-a-4905
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

### Stripe Setup
1. Create a [Stripe account](https://stripe.com)
2. Get your publishable key from the dashboard
3. Add the key to your `.env` file
4. Set up webhook endpoints for subscription management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppShell.jsx    # Main app layout
│   ├── Button.jsx      # Button component
│   ├── Card.jsx        # Card component
│   ├── Input.jsx       # Input component
│   ├── List.jsx        # List component
│   ├── Map.jsx         # Map component
│   └── Select.jsx      # Select component
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication & subscription
│   └── DataContext.jsx # Data management
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── Providers.jsx   # Provider directory
│   ├── UrgentCare.jsx  # Urgent care finder
│   ├── Programs.jsx    # Health programs
│   ├── Appointments.jsx # Appointment management
│   └── Profile.jsx     # User profile
├── services/           # API services
│   ├── api.js          # Base API service
│   ├── googleMaps.js   # Google Maps integration
│   ├── stripe.js       # Stripe payments
│   ├── openFDA.js      # Health data APIs
│   ├── appointments.js # Appointment booking
│   └── index.js        # Service exports
└── utils/              # Utility functions
    └── cn.js           # Class name utility
```

## 🎨 Design System

The app uses a comprehensive design system with:

- **Colors**: Primary, accent, background, surface, error, success
- **Typography**: Display, headings, body text, captions
- **Spacing**: Consistent spacing scale (xs to xxl)
- **Border Radius**: Small, medium, large, full
- **Shadows**: Card and modal shadows
- **Motion**: Smooth animations with cubic-bezier easing

## 🔌 API Integration

### Google Maps Services
- **Geocoding**: Convert addresses to coordinates
- **Places Search**: Find nearby healthcare providers
- **Place Details**: Get detailed provider information

### OpenFDA Services
- **Drug Information**: Search FDA drug database
- **Device Recalls**: Get medical device recall information
- **Health Programs**: Local health program data

### Appointment Services
- **Slot Management**: Get available appointment times
- **Booking**: Create, update, cancel appointments
- **Insurance Verification**: Verify coverage and costs

## 💳 Subscription Model

HealthLocal uses a freemium subscription model:

### Free Tier
- Basic provider directory
- Location search
- Basic filtering
- Up to 5 searches per day

### Premium Tier ($5/month)
- Unlimited provider search
- Advanced filtering
- Direct appointment booking
- Real-time availability
- Insurance verification
- Priority support
- Appointment reminders

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Make sure to set all required environment variables in your production environment:
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL`

### Docker Deployment
```bash
docker build -t healthlocal .
docker run -p 3000:3000 healthlocal
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@healthlocal.com or create an issue in this repository.

## 🙏 Acknowledgments

- Google Maps API for location services
- Stripe for payment processing
- OpenFDA for health data
- Tailwind CSS for styling
- Lucide React for icons

---

**Made with ❤️ for better healthcare access**
