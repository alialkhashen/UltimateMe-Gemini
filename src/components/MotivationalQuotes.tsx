
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MotivationalQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState({ text: '', author: '' });
  const [isLoading, setIsLoading] = useState(false);

  const quotes = [
    { text: "Every sunrise is proof that you have been given another chance to rewrite your story.", author: "" },
    { text: "The life you dream of will not come to you—you must walk boldly toward it.", author: "" },
    { text: "Discipline is the highest form of self-love; it is choosing what you want most over what you want now.", author: "" },
    { text: "Comfort is a beautiful cage; break it, and you'll find your wings.", author: "" },
    { text: "The person you are tomorrow is built by the choices you make today.", author: "" },
    { text: "If you can endure the storm, you will learn how to command the sky.", author: "" },
    { text: "The pain of growth is temporary, but the regret of staying the same lasts forever.", author: "" },
    { text: "Don't chase perfection—chase progress that never ends.", author: "" },
    { text: "You are not behind. You are exactly where your struggle needs you to be.", author: "" },
    { text: "The limits you believe in exist only in your mind.", author: "" },
    { text: "Failure is not the end; it is the fire that forges resilience.", author: "" },
    { text: "When you want to quit, remember: the version of you who never gave up is watching.", author: "" },
    { text: "Fear is the test that separates those who dream from those who rise.", author: "" },
    { text: "The mountain you carry on your back was meant to teach you how to climb.", author: "" },
    { text: "Your scars are proof that you are stronger than what tried to break you.", author: "" },
    { text: "A river cuts through rock not because of power, but because of persistence.", author: "" },
    { text: "You will never know your strength until the weight feels unbearable.", author: "" },
    { text: "Greatness begins where comfort ends.", author: "" },
    { text: "Stop asking for easy days; ask for the strength to conquer hard ones.", author: "" },
    { text: "Every struggle is the universe whispering: 'You are ready for more.'", author: "" },
    { text: "Success is built on the quiet mornings when no one is watching.", author: "" },
    { text: "If the path is crowded, it doesn't lead to greatness.", author: "" },
    { text: "Be so consistent that even your doubts lose faith in themselves.", author: "" },
    { text: "The future belongs to those who refuse to waste the present.", author: "" },
    { text: "Dreams are free. Sacrifice is the price of turning them into reality.", author: "" },
    { text: "Do not fear the darkness—it is where stars are born.", author: "" },
    { text: "Your greatest enemy is the comfort of who you already are.", author: "" },
    { text: "The universe rewards those who act while others hesitate.", author: "" },
    { text: "Fear is just a door; courage is the key.", author: "" },
    { text: "The version of you who has everything you want is waiting for you to catch up.", author: "" },
    { text: "Nothing grows in comfort; nothing survives without change.", author: "" },
    { text: "Break your excuses before they break your potential.", author: "" },
    { text: "Progress whispers; excuses scream. Listen carefully.", author: "" },
    { text: "Every decision you make is a vote for the person you wish to become.", author: "" },
    { text: "The day you stop growing is the day you start dying.", author: "" },
    { text: "Don't just chase success—become the kind of person success chases.", author: "" },
    { text: "Every champion was once a beginner who refused to quit.", author: "" },
    { text: "Growth is not found in the applause, but in the silence of unseen effort.", author: "" },
    { text: "Stop waiting for the right time; it will never come. Start, and the time becomes right.", author: "" },
    { text: "Success isn't built overnight—it is carved brick by brick through sacrifice.", author: "" },
    { text: "Greatness demands a price. Pay it daily.", author: "" },
    { text: "Every hour wasted today becomes a chain tomorrow.", author: "" },
    { text: "Courage is not the absence of fear; it is walking forward despite it.", author: "" },
    { text: "The world bows to those who refuse to kneel before defeat.", author: "" },
    { text: "If you want to change your life, you must first change your days.", author: "" },
    { text: "Excuses are lies you tell your future to keep it from arriving.", author: "" },
    { text: "Strength is not in what you lift, but in what you refuse to drop.", author: "" },
    { text: "The man or woman you admire most exists within you—waiting for you to awaken them.", author: "" },
    { text: "Failure is feedback; use it as fuel.", author: "" },
    { text: "Destiny favors the relentless.", author: "" },
    { text: "Time will pass anyway—make it your ally, not your enemy.", author: "" },
    { text: "If it was easy, it would never be worth it.", author: "" },
    { text: "Comfort dulls the soul; hardship sharpens it.", author: "" },
    { text: "You don't need more time—you need more courage.", author: "" },
    { text: "The heaviest chains are the ones we refuse to see.", author: "" },
    { text: "No ocean is crossed without leaving the shore behind.", author: "" },
    { text: "The strongest steel is forged in the hottest fire.", author: "" },
    { text: "Every ending is secretly a beginning.", author: "" },
    { text: "Don't count the obstacles—count the reasons you must keep going.", author: "" },
    { text: "Success does not ask permission; it demands persistence.", author: "" },
    { text: "You cannot control the wind, but you can always adjust your sails.", author: "" },
    { text: "Silence the voice that tells you 'not yet.' The time is now.", author: "" },
    { text: "Sacrifice is the seed of greatness.", author: "" },
    { text: "Stop chasing validation and start chasing victory.", author: "" },
    { text: "Hardship is the tuition fee of greatness.", author: "" },
    { text: "Your comfort zone is where dreams go to die.", author: "" },
    { text: "The price of success is always paid in advance.", author: "" },
    { text: "Dreams without action are the graves of potential.", author: "" },
    { text: "You were not born to live the same day over and over.", author: "" },
    { text: "The higher the climb, the stronger the view.", author: "" },
    { text: "You are capable of more than you dare to admit.", author: "" },
    { text: "Every day wasted is a debt your future self will have to pay.", author: "" },
    { text: "Stop trying to avoid the storm—learn how to dance in the rain.", author: "" },
    { text: "Growth hurts, but so does staying the same. Choose your pain.", author: "" },
    { text: "The habits you build today decide the person you become tomorrow.", author: "" },
    { text: "No one is coming to save you—be your own rescue.", author: "" },
    { text: "Success whispers to the relentless, not the hesitant.", author: "" },
    { text: "To master your life, first master your minutes.", author: "" },
    { text: "The fear of failure fades the moment you begin.", author: "" },
    { text: "Comfort is temporary; legacy is eternal.", author: "" },
    { text: "There is no shortcut—every step is the journey.", author: "" },
    { text: "The greatest wealth is discipline.", author: "" },
    { text: "Stop surviving—start living with fire.", author: "" },
    { text: "Your life will change the day you refuse to give up.", author: "" },
    { text: "The path of least resistance leads to mediocrity.", author: "" },
    { text: "Don't wait for strength—build it in the struggle.", author: "" },
    { text: "The world belongs to the doers, not the dreamers.", author: "" },
    { text: "Progress is silent until it roars.", author: "" },
    { text: "Your potential is bigger than your excuses.", author: "" },
    { text: "Hard days are blessings in disguise—they sculpt you into unshakable stone.", author: "" },
    { text: "Consistency is the hidden engine of greatness.", author: "" },
    { text: "To reach the peak, you must learn to love the climb.", author: "" },
    { text: "The strongest people are those who rise after falling.", author: "" },
    { text: "Success requires obsession—be consumed by your vision.", author: "" },
    { text: "No one remembers the excuses, only the results.", author: "" },
    { text: "Growth is lonely, but mediocrity is crowded. Choose wisely.", author: "" },
    { text: "The future is created by those who refuse to surrender.", author: "" },
    { text: "Stop negotiating with your excuses; they will cost you everything.", author: "" },
    { text: "Every sacrifice you make today plants the seed of tomorrow's victory.", author: "" },
    { text: "The journey is hard, but so are you.", author: "" }
  ];

  const getQuoteForToday = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return quotes[dayOfYear % quotes.length];
  };

  const refreshQuote = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    setCurrentQuote(getQuoteForToday());
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 border border-blue-200 dark:border-blue-700 rounded-xl px-3 sm:px-6 py-3 sm:py-4 mb-2 sm:mb-4">
      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <blockquote className="text-gray-800 dark:text-gray-200 font-medium italic text-sm sm:text-base leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          {currentQuote.author && (
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              — {currentQuote.author}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshQuote}
          disabled={isLoading}
          className="flex-shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 h-8 w-8 sm:h-10 sm:w-10"
        >
          <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default MotivationalQuotes;
