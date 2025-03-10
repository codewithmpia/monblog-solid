import SectionHead from "../components/SectionHead";

const Error = (props) => {
    return (
        <>
            <SectionHead
                title="Oups! Une erreur s'est produite"
                note={props.status ? props.status : "Une erreur s'est produite. Veuillez réessayer plus tard."}
            />
            <section class="w-full">
                <div class="max-w-screen-lg mx-auto px-3 sm:px-6 mt-8">
                    <div class="w-full flex items-center p-3 rounded-sm bg-red-50 text-red-900 border border-solid border-red-200">
                        <strong>{props.message ? props.message : "Veuillez vérifier votre connexion internet ou réessayer plus tard."}</strong>
                    </div>
                </div>
            </section>
        </>
    )
};

export default Error;