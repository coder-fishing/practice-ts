import { notification, noAvt, down} from '~/assets/icon';

export const avatarUser = (): string => {
    return `
        <div class="main-right__user">
            <div class="main-right__userAvatar">
                <img src="${noAvt}" class="main-right__userAvatar-img" alt="user avatar"/>
                <img src="${notification}" class="main-right__userAvatar-online" alt="online status"/>
            </div>
            <div class="main-right__userName">
                <span class="main-right__userName-name">Bin</span>
                <span class="main-right__userName-position">Manager</span>
            </div>
            <img src="${down}" alt="dropdown icon"/> 
        </div>
    `
}