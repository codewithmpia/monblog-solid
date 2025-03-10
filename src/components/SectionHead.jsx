import { Show } from "solid-js";
import { useLocation, A, useParams } from "@solidjs/router";
import Photo from "../assets/photo.jpeg";

const SectionHead = (props) => {
    const location = useLocation();
    const params = useParams();
    const isPostPage = () => params.slug !== undefined;
    const isErrorPage = () => location.pathname === "/404" || props.isError;
    
    return (
        <section class="w-full -mt-20">
            <div class="max-w-screen-lg mx-auto px-3 sm:px-6">
                <div class="w-full bg-white rounded-xl shadow border border-solid border-gray-200 p-3 sm:p-6">
                    <div class="w-full flex items-center gap-6">
                        {/* Photo uniquement sur la page d'accueil et pas sur les pages d'erreur */}
                        <Show when={location.pathname === "/" && !isErrorPage()}>
                            <div class="md:block hidden w-44 h-36 rounded-xl shadow-sm border border-solid border-gray-100">
                                <img src={Photo} alt="Ma photo" class="w-full h-full rounded-xl" />
                            </div>
                        </Show>
                        
                        <div class="w-full flex flex-col gap-3">
                            {/* Partie supérieure avec les liens uniquement si ce n'est pas une page d'erreur */}
                            <Show when={!isErrorPage()}>
                                <div class="w-full flex items-center justify-between">
                                    <Show when={location.pathname !== "/"}>
                                        <A href="/" class="w-full flex items-center gap-0.5 uppercase underline text-sm text-[#297EF6]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round">
                                                <path d="m15 18-6-6 6-6" />
                                            </svg>
                                            <span>Retour</span>
                                        </A>
                                    </Show>
                                    <Show when={props.link}>
                                        <a href={props.link} target="_blank" class="w-full flex items-center justify-end gap-0.5 uppercase text-sm text-[#297EF6]">
                                            <span>Github</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                                                <path d="m21 3-9 9" />
                                                <path d="M15 3h6v6" />
                                            </svg>
                                        </a>
                                    </Show>
                                </div>
                            </Show>
                            
                            {/* Titre et note toujours affichés */}
                            <h1 class="text-3xl font-bold">{props.title}</h1>
                            <p>{props.note}</p>
                            
                            {/* Informations supplémentaires uniquement pour les pages d'article et pas sur les pages d'erreur */}
                            <Show when={isPostPage() && !isErrorPage() && props.date && props.author}>
                                <div class="w-full flex items-center gap-6 text-sm uppercase">
                                    <span>{props.date}</span>
                                    <span>{props.author}</span>
                                    <Show when={props.views !== undefined}>
                                        <span>{props.views} Vues</span>
                                    </Show>
                                </div>
                            </Show>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SectionHead;