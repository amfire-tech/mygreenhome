import { forwardRef } from 'react';
import PlantCard from './PlantCard';

// Container for a scene's 3 plant cards.
//
// forwardRef → the container. App.jsx writes:
//   • CSS vars --par-x / --par-y  (mouse parallax — see .parallax-cards)
//   • style.opacity               (scene-progress fade in/out)
// Layout (right rail / tablet / bottom row) lives in .parallax-cards CSS.
//
// App also sets key={sceneId} so this re-mounts each scene, and toggles
// `visible` at the scene's reveal threshold to fire the staggered card lift.
const PlantCards = forwardRef(function PlantCards({ cards = [], visible }, ref) {
  return (
    <div
      ref={ref}
      className="parallax-cards"
      style={{ opacity: 0 }} // App controls opacity each frame
      aria-hidden={!visible}
    >
      {cards.map((card, i) => (
        <PlantCard key={card.name} card={card} index={i} visible={visible} />
      ))}
    </div>
  );
});

export default PlantCards;
