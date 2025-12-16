
import React, { useState } from 'react';
import { MapPin, Wifi, Coffee, Utensils, Waves, CalendarCheck, Home, Tv, Wind, Dog, Users, Globe, CheckCircle, Ban, ShowerHead, Instagram, Phone, User, Send as SendIcon, Loader2, Minus, Plus, Calendar, Train, Plane, UtensilsCrossed, Zap, Shirt } from 'lucide-react';
import { DatePicker } from './components/DatePicker';

function App() {
  // Booking State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0); // 2-12 anni
  const [infants, setInfants] = useState(0); // < 2 anni

  // Helper per calcolare totale "teste" (Adulti + Bambini)
  const totalMainGuests = adults + children;
  const maxMainGuests = 2;

  const galleryImages = [
    "/immagini/sala.jpg",
    "/immagini/camera-klimt.jpg",
    "/immagini/camera-cuscini.jpg",
    "/immagini/bagno-pietra.jpg",
    "/immagini/esterno.jpg",
    "immagini/posta.jpg"
  ];

  const incrementAdults = () => {
    if (totalMainGuests < maxMainGuests) {
      setAdults(prev => prev + 1);
    }
  };

  const decrementAdults = () => {
    if (adults > 1) {
      setAdults(prev => prev - 1);
    }
  };

  const incrementChildren = () => {
    if (totalMainGuests < maxMainGuests) {
      setChildren(prev => prev + 1);
    }
  };

  const decrementChildren = () => {
    if (children > 0) {
      setChildren(prev => prev - 1);
    }
  };

  const incrementInfants = () => {
    if (infants < 1) { // Limitiamo a 1 neonato ragionevolmente per lo spazio
      setInfants(prev => prev + 1);
    }
  };

  const decrementInfants = () => {
    if (infants > 0) {
      setInfants(prev => prev - 1);
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
        alert("Seleziona le date di check-in e check-out.");
        return;
    }

    // Costruzione URL Airbnb
    const baseUrl = "https://www.airbnb.it/rooms/7941460";
    const params = new URLSearchParams({
        source_impression_id: "p3_1764871829_P3QyFIgb1DB2TuzK",
        check_in: checkIn,
        check_out: checkOut,
        guests: (adults + children + infants).toString(),
        adults: adults.toString(),
        children: children.toString(),
        infants: infants.toString()
    });

    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  const handleBookingDotCom = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
        alert("Seleziona le date di check-in e check-out.");
        return;
    }

    // Costruzione URL Booking.com
    const baseUrl = "https://www.booking.com/hotel/it/la-casa-di-lo.it.html";
    const params = new URLSearchParams({
        checkin: checkIn,
        checkout: checkOut,
        group_adults: adults.toString(),
        req_adults: adults.toString(),
        no_rooms: "1",
    });

    if (children > 0) {
        params.append('group_children', children.toString());
        params.append('req_children', children.toString());
        // Booking richiede un'età per ogni bambino. Poiché il form ha un range 2-12, usiamo 5 come media
        for (let i = 0; i < children; i++) {
            params.append('age', '5');
            params.append('req_age', '5');
        }
    }
    
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDateDisplay = (dateStr: string) => {
      if (!dateStr) return 'Seleziona data';
      const d = new Date(dateStr);
      return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 relative">
      
      {/* Fixed Logo / Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className="fixed top-6 left-6 z-50 bg-white/95 backdrop-blur-sm border border-puglia-sea/20 shadow-xl hover:scale-110 transition-all rounded-full cursor-pointer h-16 w-16 md:h-20 md:w-20 flex items-center justify-center overflow-hidden p-1.5"
        aria-label="Torna all'inizio"
      >
        <img 
          src="logo2.jpg" 
          alt="La Casa di LO" 
          className="w-full h-full object-contain" 
        />
      </button>

      {/* Hero Section */}
      <header className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image - High Quality Puglia Interior */}
        <div className="absolute inset-0">
          <img 
            src="immagini/sala.jpg" 
            onError={(e) => {
              // Fallback se l'immagine locale non carica
              e.currentTarget.src = "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop";
            }}
            alt="Interno La Casa di LO" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>
        
        <nav className="absolute top-0 w-full z-20 p-6 flex justify-end items-center text-white">
            <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wide uppercase bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full">
                <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-puglia-sun transition-colors cursor-pointer">La Casa</a>
                <a href="#amenities" onClick={(e) => scrollToSection(e, 'amenities')} className="hover:text-puglia-sun transition-colors cursor-pointer">Servizi</a>
                <a href="#gallery" onClick={(e) => scrollToSection(e, 'gallery')} className="hover:text-puglia-sun transition-colors cursor-pointer">Galleria</a>
                <a href="#location" onClick={(e) => scrollToSection(e, 'location')} className="hover:text-puglia-sun transition-colors cursor-pointer">Posizione</a>
                <a href="#book" onClick={(e) => scrollToSection(e, 'book')} className="hover:text-puglia-sun transition-colors cursor-pointer">Prenota</a>
            </div>
        </nav>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-serif italic mb-4 drop-shadow-lg">La Casa di LO</h1>
          <p className="text-lg md:text-2xl font-light tracking-wider mb-8 drop-shadow-md">
            Il tuo autentico rifugio in pietra nel cuore di Monopoli
          </p>
          <a 
            href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x134635d9ab938c47:0xe8e37bef98b3f6e2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm md:text-base font-medium bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-colors cursor-pointer"
          >
            <MapPin size={18} className="text-puglia-sun" />
            Vico Castelfidardo, 10, Monopoli (BA)
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-puglia-stone">
        
        {/* Intro Text */}
        <section id="about" className="py-20 px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-puglia-sea mb-8">Benvenuti a Casa</h2>
            <div className="prose prose-lg text-gray-600 mx-auto leading-relaxed">
                <p className="mb-6">
                    Ristrutturata da poco, <strong>La Casa di LO</strong> è una graziosa casetta indipendente al piano terra, caratterizzata da suggestive volte in tufo a vista e pavimentazione storica.
                </p>
                <p>
                    Situata a soli <strong>5 minuti</strong> dalla piazza centrale e dalla cattedrale, e a pochi passi dalla famosa <strong>Spiaggia di Porta Vecchia</strong>.
                    La casa offre circa 30 m² di atmosfera autentica pugliese, composta da soggiorno, cucina, camera da letto e bagno.
                </p>
                <p className="italic text-puglia-olive">
                    Possiamo ospitare 2 persone. Su richiesta possiamo fornire un lettino da viaggio per bambini.
                </p>
            </div>
        </section>

        {/* Amenities Grid */}
        <section id="amenities" className="py-16 px-6 bg-white border-y border-stone-200">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-serif text-center mb-12 text-gray-800">Comfort e Servizi</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Apartment Features */}
                    <div className="p-6 bg-stone-50 rounded-xl border border-stone-100">
                        <h3 className="text-xl font-bold text-puglia-sea mb-4 flex items-center gap-2">
                            <Home className="w-5 h-5"/> L'Appartamento
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-puglia-olive"/> Piano Terra Indipendente</li>
                            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-puglia-olive"/> Volte in tufo a vista</li>
                            <li className="flex items-center gap-2"><Zap size={16} className="text-puglia-olive"/> Check-in express</li>
                            <li className="flex items-center gap-2"><Home size={16} className="text-puglia-olive"/> Minimarket sul posto</li>
                        </ul>
                    </div>

                    {/* Comforts */}
                    <div className="p-6 bg-stone-50 rounded-xl border border-stone-100">
                        <h3 className="text-xl font-bold text-puglia-sea mb-4 flex items-center gap-2">
                            <Wind className="w-5 h-5"/> Comfort
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center gap-2"><Wifi size={16} className="text-puglia-sea"/> WiFi Gratuito</li>
                            <li className="flex items-center gap-2"><Wind size={16} className="text-puglia-sea"/> Aria Condizionata</li>
                            <li className="flex items-center gap-2"><Tv size={16} className="text-puglia-sea"/> TV Schermo Piatto (Cavo)</li>
                            <li className="flex items-center gap-2"><Shirt size={16} className="text-puglia-sea"/> Ferro e asse da stiro</li>
                        </ul>
                    </div>

                    {/* Kitchen & Bath */}
                    <div className="p-6 bg-stone-50 rounded-xl border border-stone-100">
                        <h3 className="text-xl font-bold text-puglia-sea mb-4 flex items-center gap-2">
                            <Utensils className="w-5 h-5"/> Cucina e Bagno
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center gap-2"><Utensils size={16} className="text-puglia-olive"/> Piano cottura, Forno, Frigo</li>
                            <li className="flex items-center gap-2"><Coffee size={16} className="text-puglia-olive"/> Macchina Caffè</li>
                            <li className="flex items-center gap-2"><ShowerHead size={16} className="text-puglia-sea"/> Asciugacapelli</li>
                            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-puglia-sea"/> Set cortesia in omaggio</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                     <span className="flex items-center gap-2"><Dog size={18}/> Animali Ammessi (Gratis)</span>
                     <span className="flex items-center gap-2"><Users size={18}/> Max 2 Ospiti</span>
                     <span className="flex items-center gap-2"><Ban size={18}/> No Fumatori</span>
                </div>
            </div>
        </section>

        {/* Gallery Grid */}
        <section id="gallery" className="py-16 bg-puglia-stone">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-serif text-center mb-12 text-gray-800">Galleria</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {galleryImages.map((src, index) => (
                        <div key={index} className="aspect-square overflow-hidden rounded-xl shadow-lg bg-stone-200">
                            <img 
                                src={src} 
                                alt={`La Casa di LO - Foto ${index + 1}`} 
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                                onError={(e) => {
                                   // Fallback silenzioso o placeholder se l'immagine manca
                                   e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Location Info */}
        <section id="location" className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto text-center">
                 <h2 className="text-3xl font-serif text-puglia-sea mb-10">Posizione Privilegiata</h2>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                    {/* Spiagge */}
                    <div className="space-y-4 p-4 bg-stone-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Waves className="text-puglia-sea" size={24}/>
                            <h4 className="font-bold text-gray-800 text-lg">Spiagge</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex justify-between"><span>Porta Vecchia</span> <span className="font-semibold">500 m</span></li>
                            <li className="flex justify-between"><span>Cala Porto Rosso</span> <span className="font-semibold">900 m</span></li>
                            <li className="flex justify-between"><span>Lido Pantano</span> <span className="font-semibold">1,5 km</span></li>
                        </ul>
                    </div>

                    {/* Ristoranti */}
                    <div className="space-y-4 p-4 bg-stone-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <UtensilsCrossed className="text-puglia-terracotta" size={24}/>
                            <h4 className="font-bold text-gray-800 text-lg">Nei Dintorni</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex justify-between"><span>Ristorante Il Ritrovo</span> <span className="font-semibold">150 m</span></li>
                            <li className="flex justify-between"><span>Ristorante Pizziamo</span> <span className="font-semibold">200 m</span></li>
                            <li className="flex justify-between"><span>Caffè dello Sport</span> <span className="font-semibold">250 m</span></li>
                        </ul>
                    </div>

                    {/* Trasporti */}
                    <div className="space-y-4 p-4 bg-stone-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Train className="text-puglia-olive" size={24}/>
                            <h4 className="font-bold text-gray-800 text-lg">Trasporti</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex justify-between"><span>Stazione Monopoli</span> <span className="font-semibold">850 m</span></li>
                            <li className="flex justify-between"><span className="flex items-center gap-1"><Plane size={12}/> Bari</span> <span className="font-semibold">57 km</span></li>
                            <li className="flex justify-between"><span className="flex items-center gap-1"><Plane size={12}/> Brindisi</span> <span className="font-semibold">67 km</span></li>
                        </ul>
                    </div>

                    {/* Cultura */}
                    <div className="space-y-4 p-4 bg-stone-50 rounded-lg">
                         <div className="flex items-center gap-2 mb-2">
                            <MapPin className="text-puglia-sun" size={24}/>
                            <h4 className="font-bold text-gray-800 text-lg">Attrazioni</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex justify-between"><span>Cattedrale</span> <span className="font-semibold">5 min</span></li>
                            <li className="flex justify-between"><span>Museo Egnazia</span> <span className="font-semibold">12 km</span></li>
                            <li className="flex justify-between"><span>Polignano a Mare</span> <span className="font-semibold">9 km</span></li>
                        </ul>
                    </div>
                 </div>
            </div>
        </section>

        {/* Booking Section */}
        <section id="book" className="py-20 px-6 bg-stone-100 border-t border-stone-200">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-stone-200">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-puglia-sea mb-2">Prenota il tuo soggiorno</h2>
                    <p className="text-gray-600">Verifica la disponibilità sui portali</p>
                </div>

                <form onSubmit={handleBooking} className="space-y-6 relative">
                    
                    {/* Custom Date Inputs Trigger */}
                    <div className="grid grid-cols-2 gap-0 border border-stone-300 rounded-lg overflow-hidden relative">
                        <div 
                            className="p-3 bg-stone-50 hover:bg-stone-100 cursor-pointer border-r border-stone-300 transition-colors"
                            onClick={() => setShowDatePicker(true)}
                        >
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Check-in</label>
                            <div className={`font-medium ${!checkIn ? 'text-gray-400' : 'text-gray-800'}`}>
                                {formatDateDisplay(checkIn)}
                            </div>
                        </div>
                        <div 
                            className="p-3 bg-stone-50 hover:bg-stone-100 cursor-pointer transition-colors"
                            onClick={() => setShowDatePicker(true)}
                        >
                             <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Check-out</label>
                             <div className={`font-medium ${!checkOut ? 'text-gray-400' : 'text-gray-800'}`}>
                                {formatDateDisplay(checkOut)}
                            </div>
                        </div>
                    </div>

                    {/* Date Picker Popover */}
                    {showDatePicker && (
                        <div className="absolute top-0 left-0 w-full z-20 mt-[-1rem]">
                             <DatePicker 
                                checkIn={checkIn}
                                checkOut={checkOut}
                                onSelect={(start, end) => {
                                    setCheckIn(start);
                                    setCheckOut(end);
                                }}
                                onClose={() => setShowDatePicker(false)}
                             />
                             {/* Backdrop to close on click outside (simple implementation) */}
                             <div 
                                className="fixed inset-0 z-[-1]" 
                                onClick={() => setShowDatePicker(false)}
                             />
                        </div>
                    )}

                    {/* Guests Selection */}
                    <div className="space-y-4 bg-stone-50 p-4 rounded-xl border border-stone-100 mt-4">
                        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                            <div>
                                <h4 className="font-semibold text-gray-800">Adulti</h4>
                                <p className="text-xs text-gray-500">Età 13+</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={decrementAdults} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30" disabled={adults <= 1}>
                                    <Minus size={14}/>
                                </button>
                                <span className="w-4 text-center font-medium">{adults}</span>
                                <button type="button" onClick={incrementAdults} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30" disabled={totalMainGuests >= maxMainGuests}>
                                    <Plus size={14}/>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                            <div>
                                <h4 className="font-semibold text-gray-800">Bambini</h4>
                                <p className="text-xs text-gray-500">Età 2-12</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={decrementChildren} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30" disabled={children <= 0}>
                                    <Minus size={14}/>
                                </button>
                                <span className="w-4 text-center font-medium">{children}</span>
                                <button type="button" onClick={incrementChildren} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30" disabled={totalMainGuests >= maxMainGuests}>
                                    <Plus size={14}/>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-800">Neonati</h4>
                                <p className="text-xs text-gray-500">Meno di 2 anni</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={decrementInfants} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30" disabled={infants <= 0}>
                                    <Minus size={14}/>
                                </button>
                                <span className="w-4 text-center font-medium">{infants}</span>
                                <button type="button" onClick={incrementInfants} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30" disabled={infants >= 1}>
                                    <Plus size={14}/>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <button 
                            type="submit"
                            className="w-full bg-[#FF5A5F] hover:bg-[#ff4046] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
                        >
                            <CalendarCheck size={20} />
                            Verifica disponibilità su Airbnb
                        </button>

                        <button 
                            type="button"
                            onClick={handleBookingDotCom}
                            className="w-full bg-[#003580] hover:bg-[#002860] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
                        >
                            <CalendarCheck size={20} />
                            Verifica disponibilità su Booking.com
                        </button>
                    </div>
                </form>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-stone-400 py-12 px-6 text-center">
        
        <div className="flex justify-center mb-8">
            <a 
                href="https://www.instagram.com/lacasadilo/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-0.5 rounded-lg group transform hover:scale-105 transition-transform"
            >
                <div className="bg-gray-900 group-hover:bg-gray-800 transition-colors rounded-md p-2 flex items-center gap-2">
                    <Instagram className="text-white" size={24} />
                    <span className="text-white font-medium">Seguici su Instagram</span>
                </div>
            </a>
        </div>

        <h4 className="font-serif text-2xl text-white mb-4">La Casa di LO</h4>
        <p className="mb-2">Vico Castelfidardo, 10, 70043 Monopoli BA, Italia</p>
        <p className="mb-4 text-sm">Lingue parlate: Italiano, Inglese, Francese, Spagnolo</p>
        <p className="mb-8 text-xs text-stone-500 font-mono tracking-wide">
            Numero di licenza: 072030C200040067, IT072030C200040067
        </p>
        <div className="text-sm border-t border-gray-800 pt-8">
            &copy; {new Date().getFullYear()} La Casa di LO. Tutti i diritti riservati.
        </div>
      </footer>
    </div>
  );
}

export default App;
