import { picture } from "~/assets/icon";

export interface MediaUploadProps {
  images?: {
    firstImg?: string | null;
    secondImg?: string | null;
    thirdImg?: string | null;
  };
  mode: 'add' | 'edit';
}

export const MediaUpload = ({ images, mode }: MediaUploadProps): string => {
  // Check if we have any existing images in edit mode
  const hasImages = Boolean(
    mode === 'edit' && 
    images && 
    (images.firstImg || images.secondImg || images.thirdImg)
  );
  
  return `
    <div class="form-section__field">  
      <p class="form-section__field--name">Photo</p> 
      ${EmptyUploadState(!hasImages)}
      ${FilledUploadState(hasImages, images)}
    </div>
  `;
};

const EmptyUploadState = (show: boolean): string => `
  <div class="media__upload-area upload-empty" id="emptyState" style="display: ${show ? 'flex' : 'none'}">
    <figure class="media__upload-area--figure" id="productImageArea">
      <img src="${picture}" alt="product-image" class="media__upload-area--img" id="productImage">
    </figure>
    <p class="media__upload-text">Drag and drop images here, or click add images</p>
    <div class="media__upload-info">
      <span class="images-tip">You can upload up to 3 images</span>
    </div>
    <input type="file" id="imageInputEmpty" accept="image/*" multiple style="display: none;">
    <button class="media__upload-btn thumbnail__add-btn" type="button">Add Images</button>
  </div>
`;

const FilledUploadState = (show: boolean, images?: any): string => `
  <div class="media__upload-area upload-filled" id="filledState" style="display: ${show ? 'flex' : 'none'}">
    <div class="media_upload-area list-image" id="previewContainer">
      ${ImagePreview(images?.firstImg, 0)}
      ${ImagePreview(images?.secondImg, 1)}
      ${ImagePreview(images?.thirdImg, 2)}
    </div>
    <div class="media__upload-controls">
      <div class="media__upload-info">
        <span class="images-counter">${CountImages(images)}/3 images</span>
        <span class="images-tip">You can upload up to 3 images</span>
      </div>
      <p class="media__upload-text">Drag and drop more images here, or click add images</p>
      <div class="media__upload-buttons">
        <input type="file" id="imageInputFilled" accept="image/*" multiple style="display: none;">
        <button class="media__upload-btn thumbnail__add-btn" type="button">Add Images</button>
        <button class="media__upload-btn media__upload-btn--secondary remove-all-images" type="button">Remove All</button>
      </div>
    </div>
  </div>
`;

const ImagePreview = (src?: string, index?: number): string => {
  if (!src) return '';
  
  // Map index to slot name for existing images
  const slotNames = ['firstImg', 'secondImg', 'thirdImg'];
  const slotName = slotNames[index!] || `slot${index}`;
  
  return `
    <div class="thumbnail__preview-item" data-image-index="${index}" data-is-existing="true" data-slot-name="${slotName}">
      <img src="${src}" alt="Product image ${index! + 1}" class="thumbnail__preview-image">
      <button class="thumbnail__preview-remove-single" data-remove-index="${index}">&times;</button>
    </div>
  `;
};

// Count non-empty images in images object
const CountImages = (images?: MediaUploadProps['images']): number => {
  if (!images) return 0;
  return [images.firstImg, images.secondImg, images.thirdImg].filter(img => !!img).length;
};
