import type { InputFieldProps } from "~/types/inputFieldProps.type";
export function InputFieldProduct(props: InputFieldProps): string {
    const {
        label,
        name,
        value,
        placeholder = "",
        type = "text",
        textarea = false,
        required = false,
        disabled = false,
        options,
    } = props;

    const renderOptions = () => {
        if (!options) return '';
        const defaultOption = `<option value="" ${!value ? "selected" : ""}>Select ${label}</option>`;
        const otherOptions = options.map(
            (opt) =>
                `<option value="${opt.value}" ${value === opt.value ? "selected" : ""}>${opt.label}</option>`
        ).join("\n");
        return defaultOption + "\n" + otherOptions;
    };

    return `
        <div class="form-section__field">
            <p class="form-section__field--name">${label}${required ? " *" : ""}</p>
            ${options
            ? `<select
                    class="form-section__field--input"
                    name="${name}"
                    ${required ? "required" : ""}
                    ${disabled ? "disabled" : ""}
                >
                    ${renderOptions()}
                </select>`
            : textarea
            ? `<textarea
                    class="form-section__field--textarea"
                    placeholder="${placeholder}"
                    name="${name}"
                    ${required ? "required" : ""}
                    ${disabled ? "disabled" : ""}
                >${value ?? ""}</textarea>`
            : `<input
                    class="form-section__field--input"
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
