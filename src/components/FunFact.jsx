import { useState } from 'react';
import { Shuffle } from 'lucide-react';

const FACTS = [
  "Why don't skeletons fight each other? They don't have the guts.",
  'Octopuses have three hearts, and two of them stop beating when they swim.',
  "I would tell you a joke about pizza, but it's too cheesy.",
  'A group of flamingos is called a "flamboyance".',
  "Why don't scientists trust atoms? Because they make up everything.",
  'Honey never spoils — archaeologists have found 3,000-year-old honey that is still edible.',
  'I used to be a banker, but I lost interest.',
  'Bananas are berries, but strawberries are not.',
  "What do you call a fish with no eyes? A fsh.",
  "A single cloud can weigh more than a million pounds.",
  "Why did the scarecrow win an award? He was outstanding in his field.",
  "Sharks existed before trees.",
  "I only know 25 letters of the alphabet. I don't know y.",
  "There are more possible chess games than atoms in the observable universe.",
  "Why don't eggs tell jokes? They'd crack each other up.",
  "Wombat poop is cube-shaped.",
  "I'm reading a book on anti-gravity. It's impossible to put down.",
  "Sea otters hold hands while sleeping so they don't drift apart.",
  "What do you call a bear with no teeth? A gummy bear.",
  "A day on Venus is longer than a year on Venus.",
  "I tried to catch some fog earlier. I mist.",
  "The Eiffel Tower can be 15 cm taller during hot days.",
  "Why did the bicycle fall over? It was two tired.",
  "Cows have best friends and get stressed when separated.",
  "What's orange and sounds like a parrot? A carrot.",
  "Scotland's national animal is the unicorn.",
  "I'm on a seafood diet. I see food and I eat it.",
  "Butterflies taste with their feet.",
  "Why can't you give Elsa a balloon? She'll let it go.",
  "A bolt of lightning is five times hotter than the surface of the sun.",
];

export default function FunFact() {
  const [fact, setFact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)]);

  const shuffle = () => {
    let next = fact;
    while (next === fact && FACTS.length > 1) {
      next = FACTS[Math.floor(Math.random() * FACTS.length)];
    }
    setFact(next);
  };

  return (
    <footer className="mx-auto max-w-5xl px-4 pb-8 pt-2">
      <button
        onClick={shuffle}
        className="w-full flex items-center justify-center gap-2 text-center text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
      >
        <span>{fact}</span>
        <Shuffle size={12} className="shrink-0" />
      </button>
    </footer>
  );
}
