import { router } from "~/router/Router.js";
export function navigationItem(
  icon: string,
  iconHover: string,
  label: string,
  link: string
): HTMLElement {
  const item = document.createElement("div");
  item.className = "navigation-item";

  const img = document.createElement("img");
  img.src = icon;
  img.alt = label;

  item.appendChild(img);

  const span = document.createElement("span");
  span.className = "navigation-item__word";
  span.textContent = label;
  item.appendChild(span);

  item.addEventListener("mouseenter", () => {
    img.src = iconHover;
  });
  item.addEventListener("mouseleave", () => {
    img.src = icon;
  });
  item.addEventListener("click", () => {
    router.navigate(link);
  });

  return item;
}
