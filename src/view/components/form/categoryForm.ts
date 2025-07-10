import type { categoryFormProps } from "~/types"
import { InputField } from "./InputField";
import { picture } from "~/assets/icon";

export const categoryForm = ({ categoryData, mode}: categoryFormProps): string => {
    const categoryId = categoryData?.categoryID || '';
    
    return `
        <div class="category-form" ${categoryId ? `data-category-id="${categoryId}"` : ''}>
            <div class="thumbnail">
                <h3 class="thumbnail__title">Thumbnail</h3>
                <p class="thumbnail__subtitle">Photo</p> 
                    <div class="thumbnail__upload-area" id="emptyState" style="display: ${mode === 'edit' && categoryData.image ? 'none' : 'flex'}">
                    <div class="thumbnail__upload-icon">
                        <figure class="thumbnail__upload-icon--image">
                            <img src="${picture}" alt="upload"/>
                        </figure>
                    </div>  
                    <p class="thumbnail__upload-text">Drag and drop image here, or click add image</p>
                    <input type="file" id="imageInput" class="thumbnail__file-input" accept="image/*" hidden>
                    <button class="thumbnail__add-btn" type="button" onclick="document.getElementById('imageInput').click();">
                        <p class="thumbnail__add-btn--text">Add Image</p>
                    </button>
                </div>
                <div class="thumbnail__preview" id="previewState" style="display: ${mode === 'edit' && categoryData.image ? 'block' : 'none'}">
                    <img id="previewImage" src="${categoryData.image || ''}" alt="category thumbnail"/>
                    <div class="thumbnail__preview-remove" 
                         onclick="
                            document.getElementById('imageInput').value = '';
                            document.getElementById('previewImage').src = '';
                            document.getElementById('emptyState').style.display = 'flex';
                            document.getElementById('previewState').style.display = 'none';
                         ">×</div>
                </div>  
            </div>   

            <div class="general-info">
                <h2 class="general-info__title">General Information</h2>
             <div class="general-info__form">
                    ${InputField({
                        label: "Name",
                        name: "name",
                        value: categoryData.name || '',
                        placeholder: "Type name here...",
                        required: true
                    })}
                    ${InputField({
                        label: "Description",
                        name: "description",
                        value: categoryData.description || '',
                        placeholder: "Type description here...",
                        textarea: true,          
                        required: true
                    })}
                </div>
            </div>
            
    `
}