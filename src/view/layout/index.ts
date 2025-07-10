import { Header } from "../components/header";
import navigation from "./navigation";

export const Layout = (): HTMLElement => {
    const container = document.createElement("div");
    container.className = "container";

    const header = Header();
    const nav = navigation();

    const main = document.createElement("div");
    main.className = "main-right";
    
    const content = document.createElement("div");
    content.id = "content";
    content.className = "content";    // Put content inside main, not header
    main.appendChild(header);
    main.appendChild(content);

    // Append components to container in the right order
    container.appendChild(nav);
    container.appendChild(main);

    return container;
}