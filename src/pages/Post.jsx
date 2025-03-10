import { createSignal, createResource, createEffect, Show, For } from "solid-js";
import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import apiService from "../api";
import SectionHead from "../components/SectionHead";
import Alert from "../components/Alert";
import Person from "../assets/Person.png";
import SectionTransition from "../components/SectionTransition";
import NotFound from "../pages/NotFound";
import MarkdownRenderer from "../components/MarkdownRenderer";

const Post = () => {
    const params = useParams();
    const [articleNotFound, setArticleNotFound] = createSignal(false);
    const [status, setStatus] = createSignal({ submitted: false, success: false, error: false, message: "", category: "" });
    const [commentForm, setCommentForm] = createSignal({ name: "", message: "" });
    const [commentErrors, setCommentErrors] = createSignal({});
    const [commentLoading, setCommentLoading] = createSignal(false);
    const [comments, setComments] = createSignal([]); // Stockage des commentaires localement

    const fetchPost = async () => {
        try {
            const postSlug = params.slug;
            if (!postSlug) throw new Error("Slug non spécifié");
            const response = await apiService.get(`/posts/${postSlug}/`);
            if (!response || Object.keys(response).length === 0) {
                setArticleNotFound(true);
                return null;
            }
            setComments(response.comments || []);
            return response;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'article:", error);
            setArticleNotFound(true);
            return null;
        }
    };

    const [post, { refetch }] = createResource(fetchPost);

    createEffect(() => {
        if (post() && post().comments) {
            setComments(post().comments);
        }
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleString('fr-FR', options);
    };

    const handleCommentChange = (e) => {
        const { name, value } = e.target;
        setCommentForm({ ...commentForm(), [name]: value });
    };

    const validateCommentForm = () => {
        const newErrors = {};
        if (!commentForm().name.trim()) newErrors.name = "Le nom est requis";
        if (!commentForm().message.trim()) newErrors.message = "Le commentaire est requis";
        else if (commentForm().message.trim().length < 5) newErrors.message = "Le commentaire doit contenir au moins 5 caractères";
        setCommentErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitComment = async (e) => {
        e.preventDefault();
        setStatus({ submitted: false });

        await new Promise(resolve => setTimeout(resolve, 0));

        if (!validateCommentForm()) {
            setStatus({ submitted: true, success: false, error: true, message: "Veuillez corriger les erreurs", category: "error" });
            return;
        }

        try {
            setCommentLoading(true);
            const postSlug = params.slug;
            const responseData = await apiService.post(`/posts/${postSlug}/`, commentForm());

            setComments(prevComments => [
                ...prevComments,
                { ...commentForm(), created_at: new Date().toISOString() } // Ajout à la fin
            ]);

            setStatus({ submitted: true, success: true, error: false, message: responseData.message || "Commentaire ajouté avec succès", category: "success" });
            setCommentForm({ name: "", message: "" });
        } catch (error) {
            console.error("Erreur lors de l'envoi du commentaire:", error);
            setStatus({ submitted: true, success: false, error: true, message: "Erreur de connexion. Réessayez plus tard.", category: "error" });
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <>
            <Show when={articleNotFound()}>
                <NotFound />
            </Show>
            <Show when={!articleNotFound() && post() && !post.loading}>
                <Title>{`${post()?.title || ''} | codewithmpia`}</Title>
                <SectionTransition animation="slide-down" duration={200} easing="ease-out">
                    <SectionHead
                        title={post()?.title || "Article"}
                        note={post()?.resume || ""}
                        link={post()?.link || ""}
                        date={formatDate(post().created_at)}
                        author={post()?.author || ""}
                        views={post()?.views || 0}
                    />
                </SectionTransition>
                <SectionTransition animation="slide-down" duration={300} easing="ease-out">
                    <section class="w-full my-8">
                        <div class="max-w-screen-lg mx-auto px-3 sm:px-6">
                            <div class="w-full flex flex-col gap-6">
                                <Show when={post()?.image_url}>
                                    <div class="w-full h-52 rounded-xl shadow">
                                        <img class="w-full h-full object-cover rounded-xl" src={post()?.image_url} alt={post()?.slug} />
                                    </div>
                                </Show>
                                <MarkdownRenderer content={post()?.content} />
                            </div>
                            <div class="w-full mt-8 flex flex-col gap-6">
                                <h3 class="text-xl font-bold">Commentaires ({comments().length})</h3>
                                <Show when={status().submitted}>
                                    <Alert category={status().category} text={status().message} dismissible={true} />
                                </Show>
                                <form onSubmit={submitComment} class="w-full">
                                    <div class="w-full md:w-1/2 mb-3">
                                        <label for="name" class="block font-medium mb-1.5">Votre nom</label>
                                        <input type="text" name="name" value={commentForm().name} onInput={handleCommentChange} class={`w-full min-h-12 outline-none border ${commentErrors().name ? 'border-red-500' : 'border-gray-300'} rounded p-3`} />
                                        <Show when={commentErrors().name}>
                                            <p class="text-red-500 text-sm mt-1">{commentErrors().name}</p>
                                        </Show>
                                    </div>
                                    <div class="w-full mb-3">
                                        <label for="message" class="block font-medium mb-1.5">Votre commentaire</label>
                                        <textarea name="message" value={commentForm().message} onInput={handleCommentChange} class={`w-full min-h-12 h-40 resize-none outline-none border ${commentErrors().message ? 'border-red-500' : 'border-gray-300'} rounded p-3`}></textarea>
                                        <Show when={commentErrors().message}>
                                            <p class="text-red-500 text-sm mt-1">{commentErrors().message}</p>
                                        </Show>
                                    </div>
                                    <button type="submit" class="bg-[#297EF6] text-white py-2 px-3 rounded shadow-sm hover:brightness-110 cursor-pointer" disabled={commentLoading()}>
                                        {commentLoading() ? 'Envoi en cours...' : 'Poster'}
                                    </button>
                                </form>
                                <Show when={comments().length > 0}>
                                    <div class="w-full flex flex-col gap-8 mt-8">
                                        <For each={comments()}>
                                            {(comment) => (
                                                <div class="w-full flex flex-col gap-3">
                                                    <div class="w-full flex items-center gap-6">
                                                        <img class="w-10 h-10 rounded-full" src={Person} alt="User Avatar" />
                                                        <div class="flex flex-col gap-0.5">
                                                            <span class="font-semibold">{comment.name}</span>
                                                            <span class="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                                                        </div>
                                                    </div>
                                                    <p>{comment.message}</p>
                                                </div>
                                            )}
                                        </For>
                                    </div>
                                </Show>
                            </div>
                        </div>
                    </section>
                </SectionTransition>
            </Show>
        </>
    );
};
export default Post;