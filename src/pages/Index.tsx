
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Camera, Image, Flag } from "lucide-react";

const Index = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [countdown, setCountdown] = useState("");
  
  // Calculate countdown to April 3rd
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const birthdayThisYear = new Date(now.getFullYear(), 3, 3); // Month is 0-indexed, so 3 is April
      
      // If birthday has passed this year, set for next year
      if (now > birthdayThisYear) {
        birthdayThisYear.setFullYear(birthdayThisYear.getFullYear() + 1);
      }
      
      const difference = birthdayThisYear.getTime() - now.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setCountdown(`${days} days, ${hours} hours, ${minutes} minutes`);
    };
    
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-yellow-600 flex flex-col items-center justify-center p-4 text-white">
      {/* Header */}
      <div className="w-full max-w-5xl text-center mb-10 animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 text-yellow-300 drop-shadow-lg">Happy Birthday Thomas!</h1>
        <p className="text-xl text-white/90">April 3rd is your special day</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Calendar className="text-yellow-300" />
          <p className="text-lg">{countdown} until your next birthday!</p>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 mb-8">
        {/* Nature images & message */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <Card className="overflow-hidden shadow-xl rounded-xl border-2 border-yellow-400">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
                alt="Nature scene with deer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera size={18} /> Nature's Beauty
                </h3>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 shadow-xl rounded-xl border-2 border-green-500">
            <h2 className="text-2xl font-bold text-black mb-3 flex items-center gap-2">
              <Flag className="text-green-600" /> For Thomas
            </h2>
            <p className="text-black/80">
              Wishing you a day filled with joy, laughter, and all the things that make you smile. 
              Your passion for nature, photography, and art inspires everyone around you.
            </p>
          </Card>
        </div>

        {/* Flip card */}
        <div className="flex justify-center items-center h-full animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div 
            className={`flip-card w-full max-w-md aspect-[3/4] cursor-pointer ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flip-card-inner">
              {/* Front of card */}
              <div className="flip-card-front bg-gradient-to-br from-yellow-400 to-red-500 rounded-xl shadow-2xl p-6 flex flex-col items-center justify-center text-center">
                <Image size={60} className="mb-4 text-white" />
                <h3 className="text-2xl font-bold text-white mb-2">A Special Message</h3>
                <p className="text-white/90 mb-4">Click to reveal</p>
                <Button variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
                  Tap to Flip
                </Button>
              </div>
              
              {/* Back of card */}
              <div className="flip-card-back bg-gradient-to-br from-black to-green-900 rounded-xl shadow-2xl p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">Happy Birthday!</h3>
                <p className="text-white/90 mb-6">
                  Thomas, thank you for being such an amazing person in my life.
                  Your guidance, support, and love mean the world to me.
                  I'm grateful to have you as my stepfather.
                </p>
                <p className="text-lg font-semibold text-yellow-300">Wishing you many more years of happiness!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery section */}
      <div className="w-full max-w-5xl animate-fade-in" style={{ animationDelay: "600ms" }}>
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300">Nature's Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
            "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
            "https://images.unsplash.com/photo-1518495973542-4542c06a5843"
          ].map((img, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg shadow-lg hover-scale">
              <img src={img} alt={`Nature ${idx+1}`} className="w-full h-60 object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
