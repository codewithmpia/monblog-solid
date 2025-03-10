import { onMount } from "solid-js";
import SolidMarkdown from "solidjs-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeAddClasses from "rehype-add-classes";
import "highlight.js/styles/github.css";

const MarkdownRenderer = (props) => {
  onMount(() => {
    document.querySelectorAll("pre").forEach((pre) => {
      // Vérifie si le bouton n'existe pas déjà
      if (!pre.querySelector(".copy-btn")) {
        const button = document.createElement("button");
        button.innerText = "Copier";
        button.className = "copy-btn absolute top-1 right-1 bg-gray-200 px-2 py-1 text-sm rounded";
        button.onclick = () => {
          const code = pre.querySelector("code")?.innerText;
          if (code) {
            navigator.clipboard.writeText(code);
            button.innerText = "Copié !";
            setTimeout(() => (button.innerText = "Copier"), 2000);
          }
        };
        
        pre.classList.add("relative");
        pre.appendChild(button);
      }
    });
  });

  return (
    <SolidMarkdown
      rehypePlugins={[
        rehypeHighlight,
        [rehypeAddClasses, { 
          pre: "bg-gray-50 p-4 rounded-lg relative overflow-x-auto", 
          code: "bg-gray-50",
          h1: "text-4xl font-bold",
          h2: "text-2xl font-bold",
          h3: "text-xl font-bold",
          h4: "text-lg font-bold",
          img: "w-full h-52 object-cover rounded-xl shadow-sm",
          hr: "border-t border-solid border-gray-300",
          li: "list-disc ml-6 my-1",
          a: "hover:underline hover:text-cyan-700",
        }]
      ]}
    >
      {props.content || ""}
    </SolidMarkdown>
  );
};

export default MarkdownRenderer;