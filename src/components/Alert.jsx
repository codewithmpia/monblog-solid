import { createSignal } from "solid-js";


const Alert = (props) => {
    const [isVisible, setIsVisible] = createSignal(true);

    // Valeurs par défaut pour les props
    const category = props.category || "info";
    const text = props.text || "";
    const dismissible = props.dismissible !== undefined ? props.dismissible : true;

    // Styles en fonction de la catégorie
    const categoryStyles = {
        info: "bg-blue-50 text-blue-800 border-blue-200",
        success: "bg-green-50 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        error: "bg-red-50 text-red-800 border-red-200"
    };

    const baseStyles = "w-full p-3 border rounded-sm flex justify-between items-center";
    const alertStyles = `${baseStyles} ${categoryStyles[category] || categoryStyles.info}`;

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <>
            {isVisible() && (
                <div role="alert" class={alertStyles}>
                    <strong>{text}</strong>
                    {dismissible && (
                        <button
                            onClick={handleClose}
                            class="ml-auto cursor-pointer"
                            aria-label="Fermer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default Alert;