import { Title } from "@solidjs/meta";
import SectionHead from "../components/SectionHead";

const NotFound = () => {
    
    return (
        <>
            <Title>Page introuvable | codewithmpia</Title>
            <SectionHead
                title="Page introuvable"
                note="La page que vous cherchez n'existe. Veuillez vérifier l'URL ou retourner à la page d'accueil."
            />
            <section class="w-full">
                <div class="max-w-screen-lg mx-auto px-3 sm:px-6 mt-8">
                    <div class="w-full flex items-center p-3 rounded-sm bg-red-50 text-red-900 border border-solid border-red-200">
                        <strong>Oups! La page que cherchez n'existe pas.</strong>
                    </div>
                </div>
            </section>
        </>
    )
};

export default NotFound;