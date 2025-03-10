import { children, createSignal, onMount, createEffect } from "solid-js";
import { useLocation } from "@solidjs/router";

const SectionTransition = (props) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = createSignal(false);
  const resolved = children(() => props.children);
  
  // Paramètres d'animation simplifiés
  const delay = props.delay || 0;
  const duration = props.duration || 400; // Réduit pour plus de fluidité
  const easing = props.easing || "ease-out";
  
  // Style d'animation optimisé pour slide-down
  const getAnimationStyle = () => {
    return {
      transition: `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`,
      "transition-delay": `${delay}ms`,
      transform: isVisible() ? "translateY(0)" : "translateY(-20px)",
      opacity: isVisible() ? "1" : "0",
      "will-change": "transform, opacity" // Optimisation performance
    };
  };
  
  // Effet pour gérer l'animation lors des changements de route
  createEffect(() => {
    // Suivre le chemin pour détecter les changements
    const path = location.pathname;
    
    // Réinitialiser l'animation
    setIsVisible(false);
    
    // Déclencher l'animation après un court délai
    setTimeout(() => {
      setIsVisible(true);
    }, 10); // Délai court pour permettre au navigateur de traiter le changement d'état
  });
  
  // Déclencher l'animation au montage initial
  onMount(() => {
    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  });
  
  return (
    <div style={getAnimationStyle()}>
      {resolved()}
    </div>
  );
};

export default SectionTransition;