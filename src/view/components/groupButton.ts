import type { ButtonConFig } from "~/types/buttonConfig.type";
import { router } from "~/router/Router";

export const groupButton = (buttons: ButtonConFig[]): string => {
  return `
        <div class="product-title__buttons">
            ${buttons
              .map(
                (btn) => `
                <button class="${btn.className}"${
                  btn.id ? ` id="${btn.id}"` : ""
                }${btn.type ? ` type="${btn.type}"` : ""} data-link="${
                  btn.link || "#"
                }" data-action="${btn.action || ""}">
                    <img src="${btn.icon}" alt="icon" class="button__icon" />
                    <span class="button__text">${btn.text}</span>
                </button>
            `
              )
              .join("")}
        </div>
    `;
};

// Global event listener để xử lý clicks
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const button = target.closest("button[data-link], button[data-action]");
  
  if (button) {
    e.preventDefault();
    
    // Xử lý navigation
    const link = button.getAttribute("data-link");
    if (link && link !== "#") {
      router.navigate(link);
      return;
    }
    
    // // Xử lý custom actions
    // const action = button.getAttribute("data-action");
    // if (action) {
    //   // Có thể dispatch custom events hoặc call specific functions
    //   switch (action) {
    //     case "add":
    //       console.log("Add button clicked");
    //       // Thực hiện logic add
    //       break;
    //     case "delete":
    //       console.log("Delete button clicked");
    //       // Thực hiện logic delete
    //       break;
    //     default:
    //       console.log(`Action: ${action}`);
    //   }
    // }
  }
});