export const iconAndNotification = ( src :string, notification: number): string => {
    return `
        <div class = "iconAndNotification">
            <img src=${src} alt="icon " class= " iconAndNotification-image" />
            ${notification > 0 ? `
             <div class = "iconAndNotification-notification">
               <p class = "iconAndNotification-notification-number">${notification}</p>
            </div>` : ''}     
        </div>
    `
}