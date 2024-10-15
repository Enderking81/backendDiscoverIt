import crypto from 'node:crypto'
export class User {
    idUser
    nickName : string
    email : string
    password : string
    categoriesPreferences : string
    favouriteList : string
    rewardPoints : number
    seller : boolean


    constructor(nickName: string, email: string, password: string, categoriesPreferences: string, favouriteList: string, rewardPoints: number, seller: boolean) {
        this.idUser = crypto.randomUUID()
        this.nickName = nickName
        this.email = email
        this.password = password
        this.categoriesPreferences = categoriesPreferences
        this.favouriteList = favouriteList
        this.rewardPoints = rewardPoints
        this.seller = seller
    }
}