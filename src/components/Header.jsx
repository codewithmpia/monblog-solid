import { A } from "@solidjs/router";
import Logo from "./icons/Logo";

const Header = () => {
    return (
        <header className="w-full h-60 bg-[url('./assets/Cover.jpeg')] bg-cover bg-center bg-no-repeat py-8">
            <div className="w-full flex items-center justify-center">
                <A href="/" className="w-30 h-full flex items-center justify-center">
                    <Logo className="w-full h-full" />
                </A>
            </div>
        </header>
    )
}

export default Header;