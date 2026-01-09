import { useState, useEffect } from 'react';

interface FlashSaleCountdownProps {
  endTime: Date;
  productName?: string;
}

export default function FlashSaleCountdown({ endTime, productName }: FlashSaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) return null;

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <i className="ri-flashlight-fill text-2xl"></i>
        <div>
          <h3 className="font-bold text-lg">Flash Sale!</h3>
          {productName && <p className="text-sm text-white/90">{productName}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Ends in:</span>
        <div className="flex gap-2">
          {timeLeft.days > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center">
              <div className="text-2xl font-bold">{timeLeft.days}</div>
              <div className="text-xs text-white/80">Days</div>
            </div>
          )}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center">
            <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs text-white/80">Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center">
            <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs text-white/80">Mins</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center">
            <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs text-white/80">Secs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
