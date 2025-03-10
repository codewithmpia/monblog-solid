import { For, Show, createSignal, createResource, createMemo } from "solid-js";
import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import SectionHead from "../components/SectionHead";
import apiService from "../api";
import Alert from "../components/Alert";
import SectionTransition from "../components/SectionTransition";

const Index = () => {
    // Titre de la page
    const pageTitle = "Tous les articles | codewithmpia";

    // Créer un état pour le terme de recherche
    const [searchTerm, setSearchTerm] = createSignal("");

    // Paramètres de pagination
    const [currentPage, setCurrentPage] = createSignal(1);
    const articlesPerPage = 6; // Nombre d'articles par page

    const truncateText = (text, length) => {
        if (text.length > length) {
            return text.substring(0, length) + "...";
        }
        return text;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleString('fr-FR', options);
    };

    const [status, setStatus] = createSignal({
        submitted: false,
        success: false,
        error: false,
        message: "",
        category: ""
    });

    const fetchPosts = async () => {
        try {
            return await apiService.get("posts/");
        } catch (error) {
            console.error("Erreur lors de la récupération des articles:", error);
            setStatus({
                submitted: true,
                success: false,
                error: true,
                message: "Impossible de charger les articles. Veuillez réessayer plus tard.",
                category: "error"
            });
            return [];
        }
    };

    const [posts, { refetch }] = createResource(fetchPosts);

    // Créer un filtre des articles basé sur le terme de recherche
    const filteredPosts = createMemo(() => {
        const searchInput = searchTerm().toLowerCase().trim();

        // Si aucun terme de recherche ou pas encore de posts, retourner tous les posts
        if (!searchInput || !posts()) return posts();

        // Diviser la recherche en mots individuels
        const searchTerms = searchInput.split(/\s+/);

        // Filtrer les posts
        return posts()?.filter(post => {
            const title = post.title.toLowerCase();
            const resume = post.resume.toLowerCase();
            const content = post.content ? post.content.toLowerCase() : '';
            const author = post.author.toLowerCase();

            // Vérifier si TOUS les termes de recherche sont présents quelque part dans l'article
            return searchTerms.every(term =>
                title.includes(term) ||
                resume.includes(term) ||
                content.includes(term) ||
                author.includes(term)
            );
        });
    });

    // Calculer les articles paginés
    const paginatedPosts = createMemo(() => {
        const filtered = filteredPosts();
        if (!filtered) return [];

        const startIndex = (currentPage() - 1) * articlesPerPage;
        return filtered.slice(startIndex, startIndex + articlesPerPage);
    });

    // Calculer le nombre total de pages
    const totalPages = createMemo(() => {
        if (!filteredPosts() || filteredPosts().length === 0) return 1;
        return Math.ceil(filteredPosts().length / articlesPerPage);
    });

    // Générer un tableau de numéros de page pour la navigation
    const pageNumbers = createMemo(() => {
        const total = totalPages();
        const current = currentPage();

        // Si 5 pages ou moins, afficher toutes les pages
        if (total <= 5) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        // Sinon, afficher la première page, la dernière page, et les pages autour de la page actuelle
        const pages = [1];

        // Ajouter les pages autour de la page actuelle
        const startPage = Math.max(2, current - 1);
        const endPage = Math.min(total - 1, current + 1);

        // Ajouter des points de suspension si nécessaire
        if (startPage > 2) {
            pages.push('...');
        }

        // Ajouter les pages du milieu
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Ajouter des points de suspension si nécessaire
        if (endPage < total - 1) {
            pages.push('...');
        }

        // Ajouter la dernière page
        if (total > 1) {
            pages.push(total);
        }

        return pages;
    });

    // Fonction pour changer de page
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages()) {
            setCurrentPage(page);
            // Faire défiler vers le haut de la page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Gérer le changement dans le champ de recherche
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        // Réinitialiser à la première page lors d'une nouvelle recherche
        setCurrentPage(1);
    };

    return (
        <>
            <Title>{pageTitle}</Title>

            <SectionTransition
                animation="slide-down"   // Options: fade, slide-up, slide-down, slide-left, slide-right, zoom, zoom-up
                duration={200}         // Durée en millisecondes
                easing="ease-out"
            >
                <SectionHead
                    link="https://github.com/codewithmpia"
                    title="Mpia M."
                    note="Passionné par les nouvelles technologies et la programmation, je partage ici mes 
            découvertes et astuces pour les développeurs.">
                </SectionHead>
            </SectionTransition>

            <SectionTransition
                animation="slide-down"
                duration={300} 
                easing="ease-out"
            >
                <section class="w-full my-8">
                    <div class="max-w-screen-lg mx-auto px-3 sm:px-6">
                        <div class="w-full flex flex-col gap-6">
                            <div class="w-full flex flex-col gap-3">
                                <div class="w-full flex items-center justify-between">
                                    <h2 class="text-xl font-bold">Publications</h2>
                                    <span class="text-gray-600">
                                        {!posts.loading && posts()?.length} Publications
                                    </span>
                                </div>
                                <input
                                    type="search"
                                    name="search"
                                    id="search"
                                    placeholder="Rechercher un article..."
                                    value={searchTerm()}
                                    onInput={handleSearchChange}
                                    class="w-full min-h-12 outline-none border border-solid border-gray-300 rounded p-3 focus:border-[#297EF6] focus:shadow-[0_0_0_3px_#4869ee3f]"
                                />
                            </div>

                            <div class="w-full">
                                {/* Message si aucun résultat de recherche */}
                                <Show when={!posts.loading && filteredPosts()?.length === 0 && searchTerm().trim() !== ""}>
                                    <Alert
                                        category="info"
                                        text={`Aucun article trouvé pour "${searchTerm()}".`}
                                        dismissible={false}
                                    />
                                </Show>

                                {/* Message si aucun article et pas de terme de recherche */}
                                <Show when={!posts.loading && posts()?.length === 0 && searchTerm().trim() === ""}>
                                    <Alert
                                        category={status().category}
                                        text="Aucun article trouvé."
                                        dismissible={false}
                                    />
                                    <button
                                        onClick={() => refetch()}
                                        class="flex items-center gap-1 mt-4 bg-[#297EF6] text-white p-2 rounded-sm cursor-pointer hover:brightness-110"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                            <path d="M3 3v5h5" />
                                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                            <path d="M16 16h5v5" />
                                        </svg>
                                        <span>Rafraîchir</span>
                                    </button>
                                </Show>

                                {/* Spinner de chargement */}
                                <Show when={posts.loading}>
                                    <div class="flex justify-center items-center py-12">
                                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#297EF6]"></div>
                                    </div>
                                </Show>
                            </div>

                            {/* Afficher les articles filtrés et paginés */}
                            <Show when={!posts.loading && paginatedPosts().length > 0}>
                                <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <For each={paginatedPosts()}>
                                        {(post) => (
                                            <A key={post.slug} href={`/${post.slug}`} class="w-full p-4 border border-solid border-gray-300 rounded hover:border-[#297EF6] group">
                                                <article class="w-full flex flex-col gap-2">
                                                    <div class="w-full flex items-center gap-6 justify-between text-sm uppercase text-gray-600">
                                                        <span>{formatDate(post.created_at)}</span>
                                                        <span>{post.author}</span>
                                                    </div>
                                                    <h2 class="text-xl font-bold group-hover:text-[#297EF6]">{truncateText(post.title, 30)}</h2>
                                                    <p class="text-gray-600">{truncateText(post.resume, 150)}</p>
                                                </article>
                                            </A>
                                        )}
                                    </For>
                                </div>

                                {/* Pagination */}
                                <Show when={totalPages() > 1}>
                                    <div class="w-full flex justify-start mt-6 text-sm">
                                        <nav class="flex items-center gap-1">
                                            {/* Bouton précédent */}
                                            <button
                                                onClick={() => goToPage(currentPage() - 1)}
                                                disabled={currentPage() === 1}
                                                class={`px-3 py-2 rounded-md ${currentPage() === 1
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-[#297EF6] hover:bg-cyan-50'}`}
                                                aria-label="Page précédente"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="m15 18-6-6 6-6" />
                                                </svg>
                                            </button>

                                            {/* Numéros de page */}
                                            <For each={pageNumbers()}>
                                                {(page) => (
                                                    <>
                                                        {page === '...' ? (
                                                            <span class="px-3 py-2">...</span>
                                                        ) : (
                                                            <button
                                                                onClick={() => goToPage(page)}
                                                                class={`px-3 py-2 rounded-md cursor-pointer ${currentPage() === page
                                                                    ? 'bg-[#297EF6] text-white'
                                                                    : 'text-gray-700 hover:bg-cyan-50'}`}
                                                                aria-label={`Page ${page}`}
                                                                aria-current={currentPage() === page ? 'page' : undefined}
                                                            >
                                                                {page}
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </For>

                                            {/* Bouton suivant */}
                                            <button
                                                onClick={() => goToPage(currentPage() + 1)}
                                                disabled={currentPage() === totalPages()}
                                                class={`px-3 py-2 rounded-md ${currentPage() === totalPages()
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-[#297EF6] hover:bg-cyan-50'}`}
                                                aria-label="Page suivante"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="m9 18 6-6-6-6" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </Show>
                            </Show>
                        </div>
                    </div>
                </section>
            </SectionTransition>
        </>
    );
};

export default Index;