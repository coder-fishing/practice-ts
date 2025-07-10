import type { InputFieldProps } from "~/types";

export function InputField(props: InputFieldProps): string {
    const {
        label,
        name,
        value,
        placeholder = "",
        type = "text",
        textarea = false,
        required = false,
        disabled = false,
    } = props;

    return `
        <div class="form-field">
            <p class="form-field__label">${label}${required ? " *" : ""
        }</p>
            ${textarea
            ? `<textarea
                        class="form-field__textarea"
                        placeholder="${placeholder}"
                        name="${name}"
                        ${required ? "required" : ""}
                        ${disabled ? "disabled" : ""}
                    >${value ?? ""}</textarea>`
            : `<input
                        class="form-field__input"
                        type="${type}"
                        placeholder="${placeholder}"
                        name="${name}"
                        value="${value ?? ""}"
                        ${required ? "required" : ""}
                        ${disabled ? "disabled" : ""}
                    />`
        }
            </div>
                `;
}
